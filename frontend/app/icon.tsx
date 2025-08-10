// frontend/app/icon.tsx
import { ImageResponse } from "next/og";
import { AppIcon } from "@/components/app-icon"; // Este debe tener export nombrado AppIcon

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

// Re-exporta AppIcon para compatibilidad o uso en otras partes
export { AppIcon };

// Imagen de app icon generada dinámicamente con ImageResponse
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "linear-gradient(to right, #c026d3, #ec4899, #f59e0b)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        color: "white",
      }}
    >
      C
    </div>,
    {
      ...size,
    }
  );
}
