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
        borderRadius: "6px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
        overflow: "hidden",
        background: "#F5F7FA",
      }}
    >


      {/* BLUE COLUMN HEADERS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "35% 1fr 1fr",
          background: "#0132B0",
          borderBottom: "1px solid #002277",
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "12px",
            textAlign: "center",
          }}
        >
          Currency
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "12px",
            textAlign: "center",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          We Buy
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.4rem, 2.4vw, 3.5rem)",
            color: "#FFFFFF",
            padding: "12px",
            textAlign: "center",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          We Sell
        </span>
      </div>

      {/* TABLE BODY */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {displayed.map((rate) => (
          <div
            key={rate.code}
            style={{
              display: "grid",
              gridTemplateColumns: "35% 1fr 1fr",
              alignItems: "center",
              flex: 1,
              borderBottom: "1px solid #D0D0D0",
            }}
          >
            {/* CURRENCY COLUMN */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "100%",
                background: "#0132B0",
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                style={{
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontSize: "clamp(1.2rem, 1.8vw, 3rem)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  width: "60px",
                }}
              >
                {rate.code}
              </span>
              
              {/* FLAG */}
              <div
                style={{
                  width: "48px",
                  height: "32px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: "#ccc",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <FlagImage countryCode={rate.countryCode} flag={rate.flag} rateCode={rate.code} />
              </div>

              {/* CIRCULAR CURRENCY SYMBOL */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#E0E0E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#0132B0",
                    fontFamily: "Roboto, Arial, sans-serif",
                  }}
                >
                  {CURRENCY_SYMBOLS[rate.code] || rate.code[0]}
                </span>
              </div>
            </div>

            {/* WE BUY */}
            <div
              style={{
                textAlign: "center",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#EAEAEA",
                borderLeft: "1px solid #B0B0B0",
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                  fontSize: "clamp(1.4rem, 2.6vw, 4rem)",
                  fontWeight: 900,
                  color: "#000000",
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
                background: "#EAEAEA",
                borderLeft: "1px solid #B0B0B0",
              }}
            >
              <span
                style={{
                  fontFamily: "'Arial Rounded MT Bold', Arial, sans-serif",
                  fontSize: "clamp(1.4rem, 2.6vw, 4rem)",
                  fontWeight: 900,
                  color: rate.sell ? "#C42021" : "#999999",
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