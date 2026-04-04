import { CurrencyRate, formatWithSpaces } from "@/lib/store";
import { useState } from "react";

interface Props {
  rates: CurrencyRate[];
  companyName: string;
}

const ExchangeRateCard = ({ rates, companyName }: Props) => {
  const displayed = rates.slice(0, 8);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "none",
        borderRadius: "8px",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      {/* COLUMN HEADERS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "35% 1fr 1fr",
          background: "#0132B0",
          borderBottom: "2px solid rgba(255,255,255,0.2)",
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(1.2rem, 2vw, 2.8rem)",
            color: "#FFFFFF",
            padding: "16px 20px",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          Currency
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.2rem, 2vw, 2.8rem)",
            color: "#FFFFFF",
            padding: "16px",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          We Buy
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.2rem, 2vw, 2.8rem)",
            color: "#FFFFFF",
            padding: "16px",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          We Sell
        </span>
      </div>

      {/* TABLE BODY */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {displayed.map((rate, index) => (
          <div
            key={rate.code}
            style={{
              display: "grid",
              gridTemplateColumns: "35% 1fr 1fr",
              alignItems: "center",
              flex: 1,
              background: index % 2 === 0 ? "#FFFFFF" : "#F4F7F9",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            {/* CURRENCY COLUMN */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                height: "100%",
                padding: "0 12px",
                background: "#0132B0",
              }}
            >
              {/* FLAG */}
              <div
                style={{
                  width: "clamp(36px, 3.5vw, 56px)",
                  height: "clamp(36px, 3.5vw, 56px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: "#E0E0E0",
                }}
              >
                <FlagImage countryCode={rate.countryCode} flag={rate.flag} rateCode={rate.code} />
              </div>

              {/* CURRENCY CODE */}
              <span
                style={{
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontSize: "clamp(1.4rem, 2vw, 2.6rem)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  letterSpacing: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                {rate.code}
              </span>
            </div>

            {/* WE BUY */}
            <div
              style={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: "1px solid rgba(0,0,0,0.05)",
                borderLeft: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Roboto, Arial, sans-serif",
                  fontSize: "clamp(1.6rem, 2.4vw, 3.2rem)",
                  fontWeight: 800,
                  color: "#1B3A6F",
                  whiteSpace: "nowrap",
                }}
              >
                {formatWithSpaces(rate.buy)}
              </span>
            </div>

            {/* WE SELL */}
            <div
              style={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Roboto, Arial, sans-serif",
                  fontSize: "clamp(1.6rem, 2.4vw, 3.2rem)",
                  fontWeight: 800,
                  color: rate.sell ? "#D32F2F" : "#94A3B8",
                  whiteSpace: "nowrap",
                }}
              >
                {rate.sell ? formatWithSpaces(rate.sell) : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const codeMap: Record<string, string> = {
  USD: "us", EUR: "eu", GBP: "gb", ZAR: "za", BWP: "bw",
  AED: "ae", JPY: "jp", CHF: "ch", CAD: "ca", AUD: "au",
  CNY: "cn", INR: "in", RAND: "za", PULA: "bw"
};

const FlagImage = ({ countryCode, flag, rateCode }: { countryCode: string; flag: string; rateCode?: string }) => {
  const [error, setError] = useState(false);
  const actualCode = (rateCode ? codeMap[rateCode.toUpperCase()] : null) || countryCode;

  if (error || !actualCode) {
    return <span style={{ fontSize: "20px", lineHeight: 1 }}>{flag}</span>;
  }
  return (
    <img
      src={`https://flagcdn.com/w80/${actualCode.toLowerCase()}.png`}
      alt={actualCode}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setError(true)}
    />
  );
};

export default ExchangeRateCard;
