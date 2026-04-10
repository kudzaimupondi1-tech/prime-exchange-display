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

  const getDisplayRows = (groupRates: CurrencyRate[]) => {
    return groupRates.slice(0, 5);
  };

  const maxRows = Math.max(1, ...EXACT_GROUPS.map(g => getDisplayRows(groupedRates[g]).length));
  const scale = Math.min(3, 5 / maxRows);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #008000",
        borderRadius: "2px",
        boxShadow: "0px 8px 20px rgba(0,0,0,0.4)",
        overflow: "hidden",
        background: "#FFFFFF",
      }}
    >
      {EXACT_GROUPS.map((group, groupIndex) => (
        <div key={group} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {/* RED HEADER */}
          <div
            style={{
              background: "#e60000",
              color: "#FFFFFF",
              textAlign: "center",
              padding: "4px 8px",
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: 800,
              fontSize: `clamp(0.8rem, ${1.8 * scale}vh, ${2.5 * scale}rem)`,
              borderTop: groupIndex > 0 ? "1px solid #008000" : "none",
              borderBottom: "1px solid #008000",
              flex: "0 0 auto",
            }}
          >
            Exchange Rates Against {group}
          </div>

          {/* BLUE SUB-HEADER */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "35% 1fr 1fr",
              background: "#0132B0",
              borderBottom: "1px solid #008000",
              flex: "0 0 auto",
            }}
          >
            <span
              style={{
                fontFamily: "Montserrat, Arial, sans-serif",
                fontWeight: 700,
                fontSize: `clamp(0.8rem, ${1.5 * scale}vh, ${2.2 * scale}rem)`,
                color: "#FFFFFF",
                padding: "6px 12px",
                textAlign: "center",
                borderRight: "1px solid #008000",
              }}
            >
              Currency
            </span>
            <span
              style={{
                fontFamily: "Montserrat, Arial, sans-serif",
                fontWeight: 800,
                fontSize: `clamp(0.8rem, ${1.5 * scale}vh, ${2.2 * scale}rem)`,
                color: "#FFFFFF",
                padding: "6px",
                textAlign: "center",
                borderRight: "1px solid #008000",
              }}
            >
              WE BUY
            </span>
            <span
              style={{
                fontFamily: "Montserrat, Arial, sans-serif",
                fontWeight: 800,
                fontSize: `clamp(0.8rem, ${1.5 * scale}vh, ${2.2 * scale}rem)`,
                color: "#FFFFFF",
                padding: "6px",
                textAlign: "center",
              }}
            >
              WE SELL
            </span>
          </div>

          {/* TABLE ROWS */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {getDisplayRows(groupedRates[group]).map((rate) => (
              <div
                key={rate.code}
                style={{
                  display: "grid",
                  gridTemplateColumns: "35% 1fr 1fr",
                  alignItems: "stretch",
                  flex: "1 1 0",
                  background: "#FFFFFF",
                  borderBottom: "1px solid rgba(0, 128, 0, 0.2)",
                  minHeight: 0,
                }}
              >
                {/* CURRENCY COLUMN */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 20px",
                    background: "#0132B0",
                    borderRight: "1px solid rgba(0, 128, 0, 0.2)",
                    gap: "12px",
                  }}
                >
                  {/* FLAG */}
                  <div
                    style={{
                      width: `clamp(24px, ${3 * scale}vh, ${40 * scale}px)`,
                      height: `clamp(24px, ${3 * scale}vh, ${40 * scale}px)`,
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

                  <span
                    style={{
                      fontFamily: "Montserrat, Arial, sans-serif",
                      fontSize: `clamp(1.1rem, ${2.4 * scale}vh, ${3.2 * scale}rem)`,
                      fontWeight: 700,
                      color: "#FFFFFF",
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
                    borderRight: "1px solid rgba(0, 128, 0, 0.2)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", sans-serif',
                      fontSize: `clamp(1.3rem, ${2.8 * scale}vh, ${3.8 * scale}rem)`,
                      fontWeight: 800,
                      color: "#000000",
                      whiteSpace: "nowrap",
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
                      fontFamily: '"Arial Rounded MT Bold", sans-serif',
                      fontSize: `clamp(1.3rem, ${2.8 * scale}vh, ${3.8 * scale}rem)`,
                      fontWeight: 800,
                      color: "#e60000",
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
