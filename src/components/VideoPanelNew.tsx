import { useState, useRef, useEffect, useCallback } from "react";
import CompanyInfoCard from "./CompanyInfoCard";
import { CompanyInfo } from "@/lib/store";

interface Props {
  companyName: string;
  displayMode?: "video" | "announcement";
  announcementText?: string;
  playlist?: string[];
  companyInfo: CompanyInfo;
}

const DEFAULT_PLAYLIST = [
  "/(1080p).mp4",
  "/0778722_AFC_Agent_Banking_TVC(1080p).mp4",
  "/0778723_AFC_DigiPay_TVC(1080p).mp4",
  "/0778728_A_life_well_linked_Internet___Corporate_Banking_TVC(1080p).mp4",
  "/AFC_Savings_Account(1080p).mp4",
  "/A_life_well_linked(1080p).mp4",
  "/Private_Banking(1080p).mp4"
];

const VIDEO_STALL_TIMEOUT = 5000; // 5 seconds

const VideoPanelNew = ({ companyName, displayMode = "video", announcementText = "", playlist = [], companyInfo }: Props) => {
  const [hasError, setHasError] = useState(false);
  const showVideo = !hasError && displayMode === "video";
  const activePlaylist = playlist.length > 0 ? playlist : DEFAULT_PLAYLIST;

  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [src0, setSrc0] = useState(activePlaylist[0]);
  const [src1, setSrc1] = useState(activePlaylist[1 % activePlaylist.length]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFallbackCard, setShowFallbackCard] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoPlayingRef = useRef(false);

  // When playlist finishes loading from Supabase, update sources
  useEffect(() => {
    if (playlist.length > 0) {
      let startIdx = 0;
      const savedIndexStr = localStorage.getItem("primeVideoIndex");
      if (savedIndexStr !== null) {
        const parsedIdx = parseInt(savedIndexStr, 10);
        if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < playlist.length) {
          startIdx = parsedIdx;
        }
      }
      setSrc0(playlist[startIdx]);
      setSrc1(playlist[(startIdx + 1) % playlist.length]);
      setCurrentIndex(startIdx);
      setActivePlayer(0);
    }
  }, [playlist]);

  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const hasRestoredTimeRef = useRef(false);

  const getActiveRef = useCallback(() => {
    return activePlayer === 0 ? videoRef0 : videoRef1;
  }, [activePlayer]);

  useEffect(() => {
    const handleGlobalPlay = () => {
      const activeRef = getActiveRef();
      if (activeRef.current) {
        activeRef.current.muted = false;
        activeRef.current.volume = 1.0;
        activeRef.current.play().catch(console.error);
      }
    };
    window.addEventListener("force-video-play", handleGlobalPlay);
    return () => window.removeEventListener("force-video-play", handleGlobalPlay);
  }, [getActiveRef]);

  // Reset stall timer - called when video is playing normally
  const resetStallTimer = useCallback(() => {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    videoPlayingRef.current = true;
    setShowFallbackCard(false);
    stallTimerRef.current = setTimeout(() => {
      // Check if video is actually stalled
      const ref = getActiveRef();
      if (ref.current && (ref.current.paused || ref.current.readyState < 3)) {
        setShowFallbackCard(true);
      }
    }, VIDEO_STALL_TIMEOUT);
  }, [getActiveRef]);

  // Start stall detection
  const startStallDetection = useCallback(() => {
    if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    stallTimerRef.current = setTimeout(() => {
      setShowFallbackCard(true);
    }, VIDEO_STALL_TIMEOUT);
  }, []);

  // Periodically save current time to localStorage
  useEffect(() => {
    if (showVideo) {
      const intervalId = setInterval(() => {
        const activeRef = getActiveRef();
        if (activeRef.current && !activeRef.current.paused) {
          localStorage.setItem("primeVideoIndex", currentIndex.toString());
          localStorage.setItem("primeVideoTime", activeRef.current.currentTime.toString());
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [showVideo, currentIndex, getActiveRef]);

  // Auto-play: start muted (browser policy), auto-unmute on first interaction
  useEffect(() => {
    if (showVideo) {
      const el = getActiveRef().current;
      if (el) {
        // Restore time once
        if (!hasRestoredTimeRef.current) {
          const savedTimeStr = localStorage.getItem("primeVideoTime");
          if (savedTimeStr !== null) {
            const savedTime = parseFloat(savedTimeStr);
            if (!isNaN(savedTime) && savedTime > 0) {
              const applyTime = () => { el.currentTime = savedTime; };
              if (el.readyState >= 1) applyTime();
              else el.addEventListener("loadedmetadata", applyTime, { once: true });
            }
          }
          hasRestoredTimeRef.current = true;
        }

        // Always start muted so autoplay is never blocked
        el.muted = true;
        el.volume = 1.0;
        el.play()
          .then(() => {
            resetStallTimer();
          })
          .catch(() => {
            startStallDetection();
          });

        // Auto-unmute on first user interaction
        const unmute = () => {
          setIsMuted(false);
          el.muted = false;
          el.volume = 1.0;
          document.removeEventListener("click", unmute);
          document.removeEventListener("keydown", unmute);
          document.removeEventListener("touchstart", unmute);
        };
        document.addEventListener("click", unmute, { once: true });
        document.addEventListener("keydown", unmute, { once: true });
        document.addEventListener("touchstart", unmute, { once: true });
      }
    }
  }, [showVideo, activePlayer]);

  // Listen for video events to detect stalls/recovery
  useEffect(() => {
    if (!showVideo) return;
    const el = getActiveRef().current;
    if (!el) return;

    const onPlaying = () => resetStallTimer();
    const onWaiting = () => startStallDetection();
    const onStalled = () => startStallDetection();
    const onError = () => setShowFallbackCard(true);

    el.addEventListener("playing", onPlaying);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("stalled", onStalled);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("stalled", onStalled);
      el.removeEventListener("error", onError);
    };
  }, [showVideo, activePlayer, resetStallTimer, startStallDetection]);

  // Cleanup stall timer
  useEffect(() => {
    return () => {
      if (stallTimerRef.current) clearTimeout(stallTimerRef.current);
    };
  }, []);

  const handleVideoEnded = () => {
    const nextIndex = (currentIndex + 1) % activePlaylist.length;
    const preloadIndex = (nextIndex + 1) % activePlaylist.length;

    if (activePlayer === 0) {
      setActivePlayer(1);
      if (videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.muted = isMuted;
        videoRef1.current.volume = 1.0;
        videoRef1.current.play().catch(() => {
          if (videoRef1.current) {
            videoRef1.current.muted = true;
            setIsMuted(true);
            videoRef1.current.play().catch(console.error);
          }
        });
      }
      setTimeout(() => setSrc0(activePlaylist[preloadIndex]), 500);
    } else {
      setActivePlayer(0);
      if (videoRef0.current) {
        videoRef0.current.currentTime = 0;
        videoRef0.current.muted = isMuted;
        videoRef0.current.volume = 1.0;
        videoRef0.current.play().catch(() => {
          if (videoRef0.current) {
            videoRef0.current.muted = true;
            setIsMuted(true);
            videoRef0.current.play().catch(console.error);
          }
        });
      }
      setTimeout(() => setSrc1(activePlaylist[preloadIndex]), 500);
    }
    setCurrentIndex(nextIndex);
  };

  if (showVideo) {
    return (
      <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hidden", background: "#000", borderRadius: "6px" }}>
        {/* PLAYER 0 */}
        <video
          ref={videoRef0}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            height: "100%", width: "100%", objectFit: "fill", borderRadius: "6px",
            opacity: 1, 
            zIndex: activePlayer === 0 ? 10 : 1
          }}
          playsInline
          muted={isMuted}
          preload="auto"
          onEnded={activePlayer === 0 ? handleVideoEnded : undefined}
          onError={() => { if (activePlayer === 0) handleVideoEnded(); }}
          src={src0}
        />
        <video
          ref={videoRef1}
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            height: "100%", width: "100%", objectFit: "fill", borderRadius: "6px",
            opacity: 1, 
            zIndex: activePlayer === 1 ? 10 : 1
          }}
          playsInline
          muted={isMuted}
          preload="auto"
          onEnded={activePlayer === 1 ? handleVideoEnded : undefined}
          onError={() => { if (activePlayer === 1) handleVideoEnded(); }}
          src={src1}
        />

        {/* GREEN FALLBACK CARD - shows when video stalls for 5+ seconds */}
        {showFallbackCard && (
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 50,
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            <CompanyInfoCard companyInfo={companyInfo} />
          </div>
        )}
      </div>
    );
  }

  if (displayMode === "announcement") {
    return (
      <div
        style={{
          height: "100%", width: "100%",
          background: "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "#fff", borderRadius: "6px", padding: "40px", textAlign: "center",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px", opacity: 0.9 }}>📢</div>
        <h2 style={{ fontFamily: "Montserrat, Arial, sans-serif", fontSize: "2.5rem", color: "#d4af37", marginBottom: "30px", textTransform: "uppercase", letterSpacing: "2px" }}>Announcement</h2>
        <p style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: "1.8rem", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", whiteSpace: "pre-wrap", maxWidth: "80%" }}>
          {announcementText || "No announcement at this time."}
        </p>
      </div>
    );
  }

  // Default: show company info card as fallback
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <CompanyInfoCard companyInfo={companyInfo} />
    </div>
  );
};

export default VideoPanelNew;
