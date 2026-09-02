import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import {
  buildPortfolioContext,
  portfolioAssistantSystemInstruction
} from "@/data/portfolioContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const model = "gemini-3.5-flash-lite";
const maxMessages = 10;
const maxMessageLength = 1200;
const maxRequestBytes = 14000;
const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 12;
const buckets = new Map();

function jsonError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

function getClientKey(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "anonymous";
}

function isRateLimited(key) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMaxRequests;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    return null;
  }

  const normalized = messages
    .slice(-maxMessages)
    .map((message) => ({
      role: message?.role === "assistant" ? "assistant" : "user",
      content: typeof message?.content === "string" ? message.content.trim() : ""
    }))
    .filter((message) => message.content);

  while (normalized[0]?.role === "assistant") {
    normalized.shift();
  }

  return normalized;
}

function toGeminiContents(messages) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content.slice(0, maxMessageLength) }]
  }));
}

function geminiStatus(error) {
  return error?.status || error?.code || error?.response?.status;
}

function isInvalidGeminiKey(error) {
  return String(error?.message || "").toLowerCase().includes("api key not valid");
}

function hasGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key !== "your_key_here");
}

export async function POST(request) {
  if (!hasGeminiApiKey()) {
    return jsonError("The portfolio assistant is not configured yet.", 503);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxRequestBytes) {
    return jsonError("Your message is too long. Please shorten it and try again.", 413);
  }

  if (isRateLimited(getClientKey(request))) {
    return jsonError("Too many chat requests. Please wait a moment and try again.", 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const messages = normalizeMessages(body?.messages);
  const latestUserMessage = [...(messages || [])].reverse().find((message) => message.role === "user");

  if (!messages?.length || !latestUserMessage) {
    return jsonError("Please send a message before starting the chat.", 400);
  }

  if (latestUserMessage.content.length > maxMessageLength) {
    return jsonError("Your message is too long. Please keep it under 1200 characters.", 413);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model,
      contents: toGeminiContents(messages),
      config: {
        systemInstruction: `${portfolioAssistantSystemInstruction}\n\nPortfolio context:\n${buildPortfolioContext()}`,
        temperature: 0.45,
        maxOutputTokens: 650
      }
    });

    const reply = response.text?.trim();
    if (!reply) {
      return jsonError("The assistant could not generate a response right now.", 502);
    }

    return NextResponse.json({ message: { role: "assistant", content: reply } });
  } catch (error) {
    const status = geminiStatus(error);

    if (status === 401 || status === 403 || isInvalidGeminiKey(error)) {
      return jsonError("The portfolio assistant is not configured correctly.", 503);
    }

    if (status === 429) {
      return jsonError("The portfolio assistant is busy right now. Please try again later.", 429);
    }

    return jsonError("Sorry, I'm temporarily unavailable. Please try again later.", 502);
  }
}
