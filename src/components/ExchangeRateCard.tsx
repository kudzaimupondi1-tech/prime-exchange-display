import { CurrencyRate, formatWithSpaces } from "@/lib/store";
import React, { useState } from "react";

interface Props {
  rates: CurrencyRate[];
  companyName: string;
}

const EXACT_GROUPS = ["ZWG", "USD", "ZAR"];

// How many rows each group can show at maximum
const GROUP_MAX: Record<string, number> = { ZWG: 8, USD: 8, ZAR: 8 };

// Given total visible rows (headers + data rows), compute a scale multiplier 0..1
// BASE_ROWS is the "comfortable" number of rows where text is full-size
const BASE_ROWS = 12;

function getScaleFactor(totalRows: number): number {
  if (totalRows <= BASE_ROWS) return 1;
  // Shrink linearly; never go below 40% to remain readable
  return Math.max(0.4, BASE_ROWS / totalRows);
}

const ExchangeRateCard = ({ rates }: Props) => {
  const groupedRates: Record<string, CurrencyRate[]> = { ZWG: [], USD: [], ZAR: [] };
  rates.forEach(rate => {
    const against = (rate.against || "ZWG").toUpperCase();
    if (groupedRates[against]) groupedRates[against].push(rate);
  });

  // Compute ACTUAL display rows per group (no hard cap other than GROUP_MAX)
  const displayGroups = EXACT_GROUPS.map(group => {
    const rows = groupedRates[group].slice(0, GROUP_MAX[group]);
    return { group, rows };
  });

  // Total rows = data rows + 1 group-header per group + 1 sub-header (Currency/WeBuy/WeSell)
  const totalRows = displayGroups.reduce((acc, g) => acc + g.rows.length + 1, 0) + 1;
  const scale = getScaleFactor(totalRows);

  // Pre-compute scaled values for convenience
  const sz = {
    groupHeader: `clamp(0.55rem, ${1.4 * scale}vw, ${3.5 * scale}rem)`,
    subHeader:   `clamp(0.6rem, ${1.6 * scale}vw, ${4 * scale}rem)`,
    code:        `clamp(0.65rem, ${1.6 * scale}vw, ${4 * scale}rem)`,
    figures:     `clamp(0.65rem, ${1.8 * scale}vw, ${4.5 * scale}rem)`,
    flagSize:    `clamp(14px, ${2.8 * scale}vw, ${80 * scale}px)`,
    flagSizePx:  Math.round(Math.max(14, Math.min(80, 28 * scale))),
    gap:         `${Math.max(4, Math.round(14 * scale))}px`,
    padLeft:     `${Math.max(4, Math.round(15 * scale))}%`,
    headerPad:   `${Math.max(3, Math.round(10 * scale))}px 8px`,
    subHeaderPad:`${Math.max(3, Math.round(10 * scale))}px 8px`,
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
      {displayGroups.map(({ group, rows }, groupIndex) => (
        <div
          key={group}
          style={{
            flex: rows.length + 1.5,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderTop: groupIndex > 0 ? "2px solid rgba(0,0,0,0.06)" : "none",
          }}
        >
          {/* GROUP HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg, #133b7a 0%, #0a2147 100%)",
              color: "#FFFFFF",
              textAlign: "center",
              padding: sz.headerPad,
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontSize: sz.groupHeader,
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

          {/* SUB-HEADER — only on first group */}
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
                  fontSize: sz.subHeader,
                  color: "#182b10",
                  padding: sz.subHeaderPad,
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
                  fontSize: sz.subHeader,
                  color: "#333333",
                  padding: sz.subHeaderPad,
                  textAlign: "center",
                }}
              >
                We Buy
              </span>
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 900,
                  fontSize: sz.subHeader,
                  color: "#c62828",
                  padding: sz.subHeaderPad,
                  textAlign: "center",
                }}
              >
                We Sell
              </span>
            </div>
          )}

          {/* DATA ROWS */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {rows.map((rate) => (
              <div
                key={`${rate.code}-${rate.against}`}
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
                    paddingLeft: sz.padLeft,
                    background: "rgba(166, 211, 136, 0.8)",
                    gap: sz.gap,
                    borderRight: "1px solid rgba(0,0,0,0.04)",
                    overflow: "hidden",
                  }}
                >
                  {/* FLAG */}
                  <div
                    style={{
                      width: sz.flagSize,
                      height: sz.flagSize,
                      minWidth: sz.flagSize,
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
                    <FlagImage countryCode={rate.countryCode} flag={rate.flag} rateCode={rate.code} emojiSize={sz.flagSize} />
                  </div>

                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: sz.code,
                      fontWeight: 900,
                      color: "#1a1a1a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {rate.code}
                  </span>
                </div>

                {/* WE BUY */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: sz.figures,
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{
                      fontFamily: '"Arial Rounded MT Bold", Arial, sans-serif',
                      fontSize: sz.figures,
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
  CNY: "cn", INR: "in", RAND: "za", PULA: "bw", ZWG: "zw",
  NZD: "nz", SAR: "sa", KES: "ke", NGN: "ng", GHS: "gh",
  TZS: "tz", UGX: "ug", ETB: "et", EGP: "eg", QAR: "qa",
  KWD: "kw", CHF2: "ch", SGD: "sg", MYR: "my", THB: "th",
  TWD: "tw", HKD: "hk", KRW: "kr", SEK: "se", NOK: "no",
  DKK: "dk", PLN: "pl", TRY: "tr", BRL: "br", MXN: "mx",
};

const FlagImage = ({
  countryCode,
  flag,
  rateCode,
  emojiSize,
}: {
  countryCode: string;
  flag: string;
  rateCode?: string;
  emojiSize?: string;
}) => {
  const [error, setError] = useState(false);
  const actualCode = (rateCode ? codeMap[rateCode.toUpperCase()] : null) || countryCode;

  if (error || !actualCode) {
    return <span style={{ fontSize: emojiSize || "1.5vw", lineHeight: 1 }}>{flag}</span>;
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
