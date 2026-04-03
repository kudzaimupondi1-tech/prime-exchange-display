import { useState, useRef } from "react";

const VideoPanel = () => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallback = (
    <div className="h-full video-fallback-gradient flex flex-col relative overflow-hidden">
      {/* Market Status */}
      <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-medium">
          Market Status
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rate-buy animate-pulse" />
          <span className="text-xs font-bold text-rate-buy tracking-wider uppercase">
            Open
          </span>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-8">
          <div
            className="w-20 h-20 2xl:w-24 2xl:h-24 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              border: "2px solid hsl(var(--gold) / 0.25)",
              background: "hsl(var(--card) / 0.5)",
            }}
          >
            <span className="text-4xl 2xl:text-5xl" style={{ color: "hsl(var(--gold) / 0.5)" }}>
              ₿
            </span>
          </div>
          <h2 className="text-xl 2xl:text-2xl font-extrabold gold-text-glow tracking-[0.2em] uppercase mb-2">
            Forex Market Display
          </h2>
          <p className="text-xs text-muted-foreground tracking-[0.15em] uppercase mb-5">
            Needhi Forex Private Limited
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            Place video file at:{" "}
            <span className="font-mono-financial" style={{ color: "hsl(var(--gold) / 0.4)" }}>
              assets/forex-video.mp4
            </span>
          </p>
        </div>
      </div>

      {/* Bottom Company Bar */}
      <div
        className="px-6 py-4"
        style={{ borderTop: "1px solid hsl(var(--board-border) / 0.25)" }}
      >
        <p className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase mb-0.5">
          Needhi Forex Private Limited
        </p>
        <p className="text-sm font-semibold text-foreground">
          Your Trusted Currency Exchange Partner
        </p>
      </div>
    </div>
  );

  if (hasError) return fallback;

  return (
    <div className="h-full relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={() => setHasError(true)}
      >
        <source src="/forex-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/10 pointer-events-none" />
    </div>
  );
};

export default VideoPanel;
