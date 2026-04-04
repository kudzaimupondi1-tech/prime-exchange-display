import { useState, useEffect, useCallback } from "react";

const FullscreenHint = () => {
  const [visible, setVisible] = useState(false);

  const goFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    setVisible(false);
  }, []);

  useEffect(() => {
    // Try fullscreen immediately (works in kiosk/some TV browsers)
    document.documentElement.requestFullscreen?.().then(() => {
      setVisible(false);
    }).catch(() => {
      // Browser blocked it — show hint and wait for first interaction
      setVisible(true);

      const handleInteraction = () => {
        goFullscreen();
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      };

      window.addEventListener("click", handleInteraction, { once: true });
      window.addEventListener("keydown", handleInteraction, { once: true });
      window.addEventListener("touchstart", handleInteraction, { once: true });

      const timer = setTimeout(() => setVisible(false), 4500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
      };
    });
  }, [goFullscreen]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "fade-hint 4.5s ease-in-out forwards",
      }}
    >
      <p style={{ fontFamily: "Montserrat, Arial, sans-serif", fontSize: "clamp(1.2rem, 2.5vw, 2rem)", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px", letterSpacing: "2px" }}>
        Click or press any key to go fullscreen
      </p>
      <p style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "rgba(255,255,255,0.5)" }}>
        TV remote · Keyboard · Mouse click
      </p>
    </div>
  );
};

export default FullscreenHint;
