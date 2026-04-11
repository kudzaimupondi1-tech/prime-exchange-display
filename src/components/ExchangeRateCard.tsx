import { CurrencyRate, formatWithSpaces } from "@/lib/store";
import React, { useState } from "react";

interface Props {
  rates: CurrencyRate[];
  companyName: string;
}

const ExchangeRateCard = ({ rates }: Props) => {
  const EXACT_GROUPS = ["ZWG", "USD", "ZAR"];

  const groupedRates: Record<string, CurrencyRate[]> = {
    "ZWG": [],
    "USD": [],
    "ZAR": [],
  };
  rates.forEach(rate => {
    const against = (rate.against || "ZWG").toUpperCase();
    if (groupedRates[against]) {
      groupedRates[against].push(rate);
    }
  });

  const getGroupLimit = (group: string) => {
    if (group === "ZAR") return 2;
    return 5;
  };

  const getDisplayRows = (group: string, groupRates: CurrencyRate[]) => {
    return groupRates.slice(0, getGroupLimit(group));
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.98)",
        boxShadow: "0px 8px 30px rgba(0,0,0,0.12)",
        borderRadius: "10px",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {EXACT_GROUPS.map((group, groupIndex) => (
        <div key={group} style={{ 
          flex: getGroupLimit(group) + 1.5, 
          display: "flex", 
          flexDirection: "column", 
          minHeight: 0,
          borderTop: groupIndex > 0 ? "2px solid rgba(0,0,0,0.06)" : "none",
        }}>
          {/* HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg, #133b7a 0%, #0a2147 100%)",
              color: "#FFFFFF",
              textAlign: "center",
              padding: "10px 8px",
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontSize: "clamp(0.9rem, 1.6vw, 2rem)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 2,
              position: "relative",
              flex: "0 0 auto",
            }}
          >
            Exchange Rates against the {group}
          </div>

          {/* SUB-HEADER */}
          {groupIndex === 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "33% 1fr 1fr",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                flex: "0 0 auto",
                background: "#fafafa",
                zIndex: 1,
              }}
            >
              <span
                style={{
                  background: "linear-gradient(180deg, #b8e0a1 0%, #a6d388 100%)",
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(1.1rem, 2.2vh, 2.6rem)",
                  color: "#182b10",
                  padding: "10px 8px",
                  textAlign: "center",
                  borderRight: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                Currency
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(1.1rem, 2.2vh, 2.6rem)",
                  color: "#333333",
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                We Buy
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 900,
                  fontSize: "clamp(1.1rem, 2.2vh, 2.6rem)",
                  color: "#c62828",
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                We Sell
              </span>
            </div>
          )}

          {/* TABLE ROWS */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {getDisplayRows(group, groupedRates[group]).map((rate) => (
              <div
                key={rate.code}
                style={{
                  display: "grid",
                  gridTemplateColumns: "33% 1fr 1fr",
                  alignItems: "stretch",
                  flex: "1 1 0",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  minHeight: 0,
                }}
              >
                {/* CURRENCY COLUMN */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: "15%",
                    background: "rgba(166, 211, 136, 0.8)",
                    gap: "14px",
                    borderRight: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  {/* FLAG */}
                  <div
                    style={{
                      width: "clamp(20px, 3.5vh, 50px)",
                      height: "clamp(20px, 3.5vh, 50px)",
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: "#E0E0E0",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    <FlagImage countryCode={rate.countryCode} flag={rate.flag} rateCode={rate.code} />
                  </div>

                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: "clamp(1rem, 2vh, 2.5rem)",
                      fontWeight: 900,
                      color: "#1a1a1a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rate.code}
                  </span>
                </div>

                {/* WE BUY */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: "clamp(1.1rem, 2.5vh, 3.2rem)",
                      fontWeight: 900,
                      color: "#222222",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {formatWithSpaces(rate.buy)}
                  </span>
                </div>

                {/* WE SELL */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: "clamp(1.1rem, 2.5vh, 3.2rem)",
                      fontWeight: 900,
                      color: "#c62828",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.2px",
                    }}
                  >
                    {rate.sell ? formatWithSpaces(rate.sell) : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
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
    return <span style={{ fontSize: "clamp(12px, 1.8vh, 32px)", lineHeight: 1 }}>{flag}</span>;
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
