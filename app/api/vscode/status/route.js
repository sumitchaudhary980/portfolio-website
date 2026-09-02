import { NextResponse } from "next/server";

const heartbeatTimeoutMs = 3 * 60 * 1000;

let latestHeartbeat = {
	coding: false,
	project: "",
	file: "",
	language: "",
	lastSeen: null
};

function isAuthorized(request) {
	const expectedToken = process.env.VSCODE_STATUS_TOKEN;

	if (!expectedToken) {
		return false;
	}

	const authHeader =
		request.headers.get("authorization") || "";

	const bearerToken = authHeader.startsWith("Bearer ")
		? authHeader.slice(7)
		: "";

	const headerToken =
		request.headers.get("x-vscode-status-token") || "";

	return (
		bearerToken === expectedToken ||
		headerToken === expectedToken
	);
}

function sanitize(value, maxLength = 100) {
	if (typeof value !== "string") {
		return "";
	}

	return value
		.replace(/[^\w\s.#/+\-()]/g, "")
		.trim()
		.slice(0, maxLength);
}

function safeStatus() {
	const lastSeenTime = latestHeartbeat.lastSeen
		? new Date(latestHeartbeat.lastSeen).getTime()
		: 0;

	const isFresh =
		latestHeartbeat.coding &&
		lastSeenTime &&
		Date.now() - lastSeenTime <= heartbeatTimeoutMs;

	return {
		coding: Boolean(isFresh),
		status: isFresh ? "Coding" : "Offline",
		project: isFresh ? latestHeartbeat.project : "",
		file: isFresh ? latestHeartbeat.file : "",
		language: isFresh ? latestHeartbeat.language : "",
		lastSeen: latestHeartbeat.lastSeen,
		timeoutMs: heartbeatTimeoutMs
	};
}

export async function GET() {
	return NextResponse.json(safeStatus(), {
		headers: {
			"Cache-Control": "no-store"
		}
	});
}

export async function POST(request) {
	if (!process.env.VSCODE_STATUS_TOKEN) {
		return NextResponse.json(
			{
				error:
					"VS Code status heartbeat is not configured."
			},
			{
				status: 503,
				headers: {
					"Cache-Control": "no-store"
				}
			}
		);
	}

	if (!isAuthorized(request)) {
		return NextResponse.json(
			{
				error: "Unauthorized."
			},
			{
				status: 401,
				headers: {
					"Cache-Control": "no-store"
				}
			}
		);
	}

	let body = {};

	try {
		body = await request.json();
	} catch {
		body = {};
	}

	latestHeartbeat = {
		coding: body.coding !== false,
		project: sanitize(body.project, 100),
		file: sanitize(body.file, 200),
		language: sanitize(body.language, 32),
		lastSeen: new Date().toISOString()
	};

	return NextResponse.json(safeStatus(), {
		headers: {
			"Cache-Control": "no-store"
		}
	});
}