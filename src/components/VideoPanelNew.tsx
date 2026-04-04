import { useState, useRef, useEffect } from "react";

interface Props {
  companyName: string;
  displayMode?: "video" | "announcement";
  announcementText?: string;
  playlist?: string[];
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

const VideoPanelNew = ({ companyName, displayMode = "video", announcementText = "", playlist = [] }: Props) => {
  const [hasError, setHasError] = useState(false);
  const showVideo = !hasError && displayMode === "video";
  const activePlaylist = playlist.length > 0 ? playlist : DEFAULT_PLAYLIST;

  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [src0, setSrc0] = useState(activePlaylist[0]);
  const [src1, setSrc1] = useState(activePlaylist[1 % activePlaylist.length]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // When playlist finishes loading from Supabase, update the stagnant initial sources
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
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const forcePlay = () => {
    const activeRef = activePlayer === 0 ? videoRef0 : videoRef1;
    if (activeRef.current) {
      activeRef.current.muted = false;
      activeRef.current.volume = 1.0;
      activeRef.current.play().catch(console.error);
      setNeedsInteraction(false);
    }
  };

  // Periodically save current time to localStorage so it resumes after refresh
  useEffect(() => {
    if (showVideo) {
       const intervalId = setInterval(() => {
         const activeRef = activePlayer === 0 ? videoRef0 : videoRef1;
         if (activeRef.current && !activeRef.current.paused) {
           localStorage.setItem("primeVideoIndex", currentIndex.toString());
           localStorage.setItem("primeVideoTime", activeRef.current.currentTime.toString());
         }
       }, 1000);
       return () => clearInterval(intervalId);
    }
  }, [showVideo, activePlayer, currentIndex]);

  // Auto-play with sound: start muted to satisfy browser autoplay policy,
  // then immediately unmute so audio plays without any user interaction needed.
  useEffect(() => {
    if (showVideo) {
      const activeRef = activePlayer === 0 ? videoRef0 : videoRef1;
      const el = activeRef.current;
      if (el) {
        
        // Restore time exactly once on initial load
        if (!hasRestoredTimeRef.current) {
           const savedTimeStr = localStorage.getItem("primeVideoTime");
           if (savedTimeStr !== null) {
              const savedTime = parseFloat(savedTimeStr);
              if (!isNaN(savedTime) && savedTime > 0) {
                  const applyTime = () => { el.currentTime = savedTime; };
                  if (el.readyState >= 1) { // HAVE_METADATA
                    applyTime();
                  } else {
                    el.addEventListener("loadedmetadata", applyTime, { once: true });
                  }
              }
           }
           hasRestoredTimeRef.current = true;
        }

        // We attempt to play unmuted first. If the browser blocks it, it will throw an error.
        el.muted = false;
        el.volume = 1.0;
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Browser blocked unmuted autoplay:", err);
            // Fallback: play muted so the video is at least moving
            el.muted = true;
            el.play().catch(e => console.error("Muted fallback failed:", e));
            setNeedsInteraction(true);
          });
        }
      }
    }
  }, [showVideo, activePlayer]);

  const handleVideoEnded = () => {
    const nextIndex = (currentIndex + 1) % activePlaylist.length;
    const preloadIndex = (nextIndex + 1) % activePlaylist.length;
    
    if (activePlayer === 0) {
      // Player 0 ended. Activate player 1.
      setActivePlayer(1);
      if (videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.muted = false;
        videoRef1.current.volume = 1.0;
        videoRef1.current.play().catch(e => {
            console.error("Play error:", e);
            setNeedsInteraction(true);
            if (videoRef1.current) {
                videoRef1.current.muted = true;
                videoRef1.current.play().catch(console.error);
            }
        });
      }
      setTimeout(() => {
        setSrc0(activePlaylist[preloadIndex]);
      }, 500);
    } else {
      // Player 1 ended. Activate player 0.
      setActivePlayer(0);
      if (videoRef0.current) {
        videoRef0.current.currentTime = 0;
        videoRef0.current.muted = false;
        videoRef0.current.volume = 1.0;
        videoRef0.current.play().catch(e => {
            console.error("Play error:", e);
            setNeedsInteraction(true);
            if (videoRef0.current) {
                videoRef0.current.muted = true;
                videoRef0.current.play().catch(console.error);
            }
        });
      }
      setTimeout(() => {
        setSrc1(activePlaylist[preloadIndex]);
      }, 500);
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
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            height: "100%", width: "100%", objectFit: "fill", borderRadius: "6px",
            opacity: activePlayer === 0 ? 1 : 0, 
            transition: "opacity 0.4s ease-in-out",
            zIndex: activePlayer === 0 ? 10 : 1
          }}
          playsInline
          preload="auto"
          onEnded={activePlayer === 0 ? handleVideoEnded : undefined}
          onError={(e) => {
            if (activePlayer === 0) {
              console.error("Video0 error:", src0);
              handleVideoEnded();
            }
          }}
          src={src0}
        />
        {/* PLAYER 1 */}
        <video
          ref={videoRef1}
          style={{ 
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            height: "100%", width: "100%", objectFit: "fill", borderRadius: "6px",
            opacity: activePlayer === 1 ? 1 : 0, 
            transition: "opacity 0.4s ease-in-out",
            zIndex: activePlayer === 1 ? 10 : 1
          }}
          playsInline
          preload="auto"
          onEnded={activePlayer === 1 ? handleVideoEnded : undefined}
          onError={(e) => {
            if (activePlayer === 1) {
              console.error("Video1 error:", src1);
              handleVideoEnded();
            }
          }}
          src={src1}
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
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontFamily: "Montserrat, sans-serif" }}>🔇 Sound is Blocked</h1>
            <p style={{ fontSize: "1.2rem", fontFamily: "Inter, sans-serif" }}>Your browser is blocking sound. Click anywhere to unmute.</p>
          </div>
        )}
      </div>
    );
  }

  if (displayMode === "announcement") {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          borderRadius: "6px",
          padding: "40px",
          textAlign: "center",
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
