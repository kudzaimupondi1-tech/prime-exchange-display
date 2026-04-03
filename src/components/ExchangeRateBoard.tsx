import { useState, useEffect } from "react";
import { ExchangeRate } from "@/lib/rateStore";

interface Props {
  rates: ExchangeRate[];
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
};

const ExchangeRateBoard = ({ rates }: Props) => {
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{
        border: "none",
        borderRadius: "6px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
        background: "#F5F7FA",
      }}
    >
      {/* 1. RED HEADER */}
      <div
        className="text-center"
        style={{
          background: "#C42021",
          padding: "15px 20px",
        }}
      >
        <h1
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 800,
            fontSize: "36px",
            letterSpacing: "1px",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          AFC BANK FOREIGN EXCHANGE RATES
        </h1>
      </div>

      {/* 2. BLUE TABLE HEADER */}
      <div
        className="grid grid-cols-[1.2fr_1fr_1fr]"
        style={{
          background: "#0132B0",
          borderBottom: "1px solid #002277",
        }}
      >
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#FFFFFF",
            padding: "12px",
          }}
        >
          Currency
        </span>
        <span
          style={{
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "22px",
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
            fontWeight: 700,
            fontSize: "22px",
            color: "#FFFFFF",
            padding: "12px",
            textAlign: "center",
            borderLeft: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          We Sell
        </span>
      </div>

      {/* 3. TABLE BODY */}
      <div className="flex-1 flex flex-col">
        {rates.map((rate) => (
          <div
            key={rate.currency}
            className="grid grid-cols-[1.2fr_1fr_1fr] items-center flex-1"
            style={{
              borderBottom: "1px solid #D0D0D0",
            }}
          >
            {/* 6. CURRENCY COLUMN */}
            <div
              className="flex items-center justify-between h-full"
              style={{
                background: "#0132B0",
                padding: "12px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily: "Montserrat, Arial, sans-serif",
                  width: "60px",
                }}
              >
                {rate.currency}
              </span>
              
              <div
                className="shrink-0 flex items-center justify-center bg-gray-300 overflow-hidden"
                style={{
                  width: "48px",
                  height: "32px",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <span className="text-xl leading-none">{rate.flag}</span>
              </div>

              {/* 7. ICON */}
              <div
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#E0E0E0",
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
                  {CURRENCY_SYMBOLS[rate.currency] || rate.currency[0]}
                </span>
              </div>
            </div>

            {/* 4. WE BUY */}
            <div
              className="text-center h-full flex items-center justify-center"
              style={{ background: "#EAEAEA", borderLeft: "1px solid #B0B0B0" }}
            >
              <span
                style={{
                  fontFamily: "Roboto, Arial, sans-serif",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#000000",
                }}
              >
                {rate.buy}
              </span>
            </div>

            {/* 5. WE SELL */}
            <div
              className="text-center h-full flex items-center justify-center"
              style={{ background: "#EAEAEA", borderLeft: "1px solid #B0B0B0" }}
            >
              <span
                style={{
                  fontFamily: "Roboto, Arial, sans-serif",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: rate.sell === "—" ? "#999" : "#C42021",
                }}
              >
                {rate.sell}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeRateBoard;
