import { useState, useEffect } from "react";
import { CurrencyRate, formatWithCommas } from "@/lib/store";

interface Props {
  rates: CurrencyRate[];
  onAdminClick: () => void;
}

const codeMap: Record<string, string> = {
  USD: "us", EUR: "eu", GBP: "gb", ZAR: "za", BWP: "bw",
  AED: "ae", JPY: "jp", CHF: "ch", CAD: "ca", AUD: "au",
  CNY: "cn", INR: "in", RAND: "za", PULA: "bw"
};

const FlagImage = ({ countryCode, flag, rateCode }: { countryCode: string; flag: string; rateCode?: string }) => {
  const [error, setError] = useState(false);
  const actualCode = (rateCode ? codeMap[rateCode.toUpperCase()] : null) || countryCode;
  
  if (error || !actualCode) {
    return <span style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)", lineHeight: 1 }}>{flag}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w40/${actualCode.toLowerCase()}.png`}
      alt={actualCode}
      style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.2)" }}
      onError={() => setError(true)}
    />
  );
};

const TickerBar = ({ rates, onAdminClick }: Props) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const dateStr = time.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  // Render entries multiple times and ensure every item has identical spacing for seamless loop
  const entries = [...rates, ...rates, ...rates, ...rates];

  return (
    <div
      style={{
        height: "110px",
        display: "flex",
        width: "100%",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* LIVE RATES badge */}
      <div
        style={{
          width: "180px",
          flexShrink: 0,
          background: "#cc0000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "#ffffff",
            animation: "pulse-dot 1.2s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(0.9rem, 1.4vw, 1.2rem)",
            color: "#FFFFFF",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          LIVE RATES
        </span>
      </div>

      {/* Scrolling ticker */}
      <div
        style={{
          flex: 1,
          background: "#0a0f1e",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          className="ticker-scroll-track"
          style={{
            display: "inline-flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            width: "max-content",
            animationDuration: "90s",
          }}
        >
          {entries.map((r, i) => (
            <span key={`${r.code}-${i}`} style={{ display: "inline-flex", alignItems: "center", marginRight: "30px" }}>
              {/* Flag image */}
              <div style={{ marginRight: "12px", display: "flex", alignItems: "center" }}>
                <FlagImage countryCode={r.countryCode} flag={r.flag} rateCode={r.code} />
              </div>

              {/* Currency code */}
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "clamp(2rem, 3.6vw, 3rem)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "1px",
              }}>
                {r.code}
              </span>

              {/* BUY label */}
              <span style={{
                fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)",
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "1px",
                marginLeft: "10px",
              }}>
                BUY
              </span>

              {/* Buy value */}
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "clamp(2rem, 3.6vw, 3rem)",
                fontWeight: 700,
                color: "#d4af37",
                marginLeft: "8px",
              }}>
                {formatWithCommas(r.buy)}
              </span>

              {/* SELL separator */}
              <span style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "2rem",
                margin: "0 8px",
              }}>
                 · SELL
              </span>

              {/* Sell value */}
              <span style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "clamp(2rem, 3.6vw, 3rem)",
                fontWeight: 700,
                color: "#ff6b6b",
                marginLeft: "8px",
              }}>
                {r.sell ? formatWithCommas(r.sell) : "—"}
              </span>

              {/* Dot separator: Every item gets one so the loop is perfectly symmetric */}
              <span style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: "3.3rem",
                margin: "0 30px",
              }}>
                ·
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Clock & Date */}
      <div
        style={{
          width: "200px",
          flexShrink: 0,
          background: "#060d1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: "clamp(1.4rem, 2vw, 1.85rem)",
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "2px",
            lineHeight: 1,
          }}
        >
          {timeStr}
        </span>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "clamp(1rem, 1.4vw, 1.3rem)",
            fontWeight: 500,
            color: "#d4af37",
            letterSpacing: "1px",
            marginTop: "4px",
          }}
        >
          {dateStr}
        </span>
        <button
          onClick={onAdminClick}
          style={{
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.12)",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginTop: "6px",
            padding: "2px",
          }}
          title="Admin"
        >
          🔒
        </button>
      </div>
    </div>
  );
};

export default TickerBar;