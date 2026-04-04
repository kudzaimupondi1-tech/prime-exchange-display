import { CurrencyRate, formatWithSpaces } from "@/lib/store";
import { useState } from "react";

interface Props {
  rates: CurrencyRate[];
  companyName: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", AED: "د.إ", JPY: "¥", CHF: "Fr",
  CAD: "C$", AUD: "A$", NZD: "NZ$", CNY: "¥", INR: "₹", SAR: "﷼",
  ZAR: "R", BWP: "P", KES: "KSh", NGN: "₦", GHS: "₵", BRL: "R$",
  MXN: "$", TRY: "₺", RUB: "₽", THB: "฿", SGD: "S$", MYR: "RM",
  KRW: "₩", PKR: "₨", PHP: "₱", IDR: "Rp", ILS: "₪",
};

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
          gridTemplateColumns: "38% 1fr 1fr",
          background: "#0132B0",
          borderBottom: "2px solid rgba(255,255,255,0.2)",
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "16px 20px",
            textAlign: "left",
            letterSpacing: "1px",
          }}
        >
          CURRENCY
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "16px",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          WE BUY
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "16px",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          WE SELL
        </span>
      </div>

      {/* TABLE BODY */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {displayed.map((rate, index) => (
          <div
            key={rate.code}
            style={{
              display: "grid",
              gridTemplateColumns: "38% 1fr 1fr",
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
                justifyContent: "flex-start",
                gap: "16px",
                height: "100%",
                padding: "0 20px",
                borderRight: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {/* FLAG */}
              <div
                style={{
                  width: "clamp(48px, 4vw, 64px)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <FlagImage countryCode={rate.countryCode} flag={rate.flag} rateCode={rate.code} />
              </div>

              {/* CURRENCY CODE */}
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                  fontSize: "clamp(1.5rem, 2vw, 3.2rem)",
                  fontWeight: 800,
                  color: "#1E293B",
                  letterSpacing: "1px",
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
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                  fontSize: "clamp(1.5rem, 2.6vw, 4.2rem)",
                  fontWeight: 900,
                  color: "#00893eff", // professional green
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
                  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                  fontSize: "clamp(1.5rem, 2.6vw, 4.2rem)",
                  fontWeight: 900,
                  color: rate.sell ? "#DC2626" : "#94A3B8", // professional red / empty grey
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
      src={`https://flagcdn.com/w40/${actualCode.toLowerCase()}.png`}
      alt={actualCode}
      style={{ width: "clamp(40px, 4vw, 80px)", height: "auto", objectFit: "cover" }}
      onError={() => setError(true)}
    />
  );
};

export default ExchangeRateCard;