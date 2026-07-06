import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} - ${siteConfig.title}`;
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background:
            "radial-gradient(circle at 18% 18%, rgba(124,58,237,.55), transparent 30%), radial-gradient(circle at 82% 18%, rgba(6,182,212,.42), transparent 28%), linear-gradient(135deg, #0B0B0F 0%, #111827 54%, #06131a 100%)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#A7F3D0" }}>
          <div style={{ width: 18, height: 18, borderRadius: 999, background: "#22C55E" }} />
          Portfolio
        </div>
        <div>
          <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.02, letterSpacing: 0 }}>
            {siteConfig.name}
          </div>
          <div style={{ marginTop: 22, fontSize: 38, color: "#67E8F9", fontWeight: 600 }}>
            {siteConfig.title}
          </div>
          <div style={{ marginTop: 30, maxWidth: 820, fontSize: 26, lineHeight: 1.42, color: "rgba(255,255,255,.74)" }}>
            Building scalable web applications with clean architecture and intuitive user experiences.
          </div>
        </div>
      </div>
    ),
    size
  );
}
