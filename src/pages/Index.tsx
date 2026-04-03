import { useState, useCallback, useEffect } from "react";
import { loadState, saveState, fetchVideoUrls, AppState } from "@/lib/store";
import ExchangeRateCard from "@/components/ExchangeRateCard";
import VideoPanelNew from "@/components/VideoPanelNew";
import TickerBar from "@/components/TickerBar";
import AdminDrawer from "@/components/AdminDrawer";
import LoginModalNew from "@/components/LoginModalNew";
import FullscreenHint from "@/components/FullscreenHint";

const Index = () => {
  const [state, setState] = useState<AppState | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [adminMode, setAdminMode] = useState<"closed" | "login" | "open">("closed");

  useEffect(() => {
    const init = async () => {
      const s = await loadState();
      setState(s);
      const vp = await fetchVideoUrls();
      setPlaylist(vp);
    };
    init();
    
    // Auto-refresh the playlist every hour just in case new videos are dropped into the bucket
    const iv = setInterval(async () => {
      const vp = await fetchVideoUrls();
      if (vp.length > 0) setPlaylist(vp);
    }, 3600000);
    return () => clearInterval(iv);
  }, []);

  const handleUpdate = useCallback((newState: AppState) => {
    setState(newState);
    saveState(newState).catch(console.error);
  }, []);

  // Listen for cancel from login modal
  useEffect(() => {
    const handler = () => setAdminMode("closed");
    window.addEventListener("admin-cancel", handler);
    return () => window.removeEventListener("admin-cancel", handler);
  }, []);

  if (!state) {
    return (
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0a0f1e", color: "#d4af37", fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem" }}>
        Loading Display...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0a0f1e",
      }}
    >
      {/* RED HEADER (Full Width) */}
      <div style={{ padding: "8px 8px 0 8px" }}>
        <div
          style={{
            background: "#C42021",
            padding: "15px 20px",
            textAlign: "center",
            borderRadius: "6px",
          }}
        >
          <h1 style={{ margin: 0, color: "#FFFFFF", fontFamily: "Montserrat, Arial, sans-serif", fontSize: "clamp(1rem, 2.2vw, 2.1rem)", letterSpacing: "1px" }}>
            <span style={{ fontWeight: 900 }}>{state.companyName}</span>{" "}
            <span style={{ fontWeight: 800 }}>FOREIGN EXCHANGE RATES</span>
          </h1>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, marginTop: "8px" }}>
        {/* Left: Exchange Rate Card — strictly constrained to prevent losing structure */}
        <div style={{ width: "46%", flexShrink: 0, height: "100%", padding: "0 4px 8px 8px" }}>
          <ExchangeRateCard rates={state.currencies} companyName={state.companyName} />
        </div>

        {/* Right: Video Panel */}
        <div style={{ flex: 1, height: "100%", padding: "0 8px 8px 4px", minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
          <VideoPanelNew 
            companyName={state.companyName} 
            displayMode={state.displayMode}
            announcementText={state.announcementText}
            playlist={playlist}
          />
        </div>
      </div>

      {/* Bottom Ticker */}
      <TickerBar
        rates={state.currencies}
        onAdminClick={() => setAdminMode("login")}
      />

      {/* Fullscreen hint */}
      <FullscreenHint />

      {/* Admin login modal */}
      {adminMode === "login" && (
        <LoginModalNew
          password={state.adminPassword}
          onLogin={() => setAdminMode("open")}
        />
      )}

      {/* Admin drawer */}
      {adminMode === "open" && (
        <AdminDrawer
          state={state}
          onUpdate={handleUpdate}
          onClose={() => setAdminMode("closed")}
        />
      )}
    </div>
  );
};

export default Index;
