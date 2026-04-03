import { useState, useRef, useEffect } from "react";

interface Props {
  videoUrl?: string;
  companyName: string;
}

const VideoPanelNew = ({ companyName }: Props) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formattedUrl = "/Media1.mp4";
  const showVideo = !hasError;

  const [needsInteraction, setNeedsInteraction] = useState(false);

  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.volume = 1.0;
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Browser blocked unmuted autoplay.", err);
          // Browser requires user interaction to play audio
          setNeedsInteraction(true);
        });
      }
    }
  }, [showVideo]);

  const forcePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(console.error);
      setNeedsInteraction(false);
    }
  };

  if (showVideo) {
    return (
      <div style={{ height: "100%", display: "flex", justifyContent: "flex-end", overflow: "hidden", background: "transparent", borderRadius: "6px" }}>
        <video
          key={formattedUrl}
          ref={videoRef}
          style={{ height: "100%", width: "auto", maxWidth: "100%", objectFit: "contain", borderRadius: "6px" }}
          autoPlay
          loop
          playsInline
          onError={() => setHasError(true)}
          src={formattedUrl}
        />
        {needsInteraction && (
          <div
            onClick={forcePlay}
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              cursor: "pointer",
              zIndex: 50,
              flexDirection: "column",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "Montserrat, sans-serif" }}>🔇 Browser Blocked Audio</h1>
            <p style={{ fontSize: "1.2rem", fontFamily: "Inter, sans-serif" }}>Click anywhere here to start the video with sound.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          border: "2px solid rgba(212,175,55,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <span style={{ fontSize: "40px", color: "rgba(212,175,55,0.5)" }}>₿</span>
      </div>
      <h2
        style={{
          fontFamily: "Montserrat, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
          color: "#d4af37",
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "8px",
        }}
      >
        {companyName}
      </h2>
      <p
        style={{
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: "clamp(0.7rem, 1vw, 0.9rem)",
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Foreign Exchange Display
      </p>
    </div>
  );
};

export default VideoPanelNew;
