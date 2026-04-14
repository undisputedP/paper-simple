import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "PaperSimple — Research Papers, Finally Made Simple";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(124, 58, 237, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(249, 115, 22, 0.1)",
            display: "flex",
          }}
        />

        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(124, 58, 237, 0.2)",
            marginBottom: 24,
            fontSize: 40,
          }}
        >
          📄
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          PaperSimple
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.7)",
            textAlign: "center",
            marginTop: 16,
            maxWidth: 700,
            display: "flex",
          }}
        >
          Research Papers, Finally Made Simple
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
          }}
        >
          {["Upload PDF", "AI Explains", "4 Depth Levels", "Free"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: 18,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    display: "flex",
                  }}
                />
                {feature}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.4)",
            display: "flex",
          }}
        >
          papersimple.pages.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
