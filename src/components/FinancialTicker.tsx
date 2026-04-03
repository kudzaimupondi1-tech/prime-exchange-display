import { ExchangeRate } from "@/lib/rateStore";

interface Props {
  rates: ExchangeRate[];
}

const FinancialTicker = ({ rates }: Props) => {
  const tickerContent = rates
    .map(
      (r) =>
        `${r.flag} ${r.currency}: Buy ${r.buy} | Sell ${r.sell}`
    )
    .join("   •   ");

  const fullContent = `${tickerContent}   •   ${tickerContent}   •   `;

  return (
    <div
      className="w-full overflow-hidden py-2.5 2xl:py-3 relative"
      style={{ background: "hsl(var(--ticker-bg))" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, hsl(var(--gold) / 0.3), transparent)" }}
      />

      <div className="ticker-track whitespace-nowrap">
        <span
          className="font-mono-financial text-base 2xl:text-lg font-semibold tracking-wider"
          style={{ color: "hsl(var(--ticker-text))" }}
        >
          {fullContent}
        </span>
      </div>

      {/* Edge fades */}
      <div
        className="absolute top-0 left-0 bottom-0 w-16 pointer-events-none"
        style={{ background: "linear-gradient(to right, hsl(var(--ticker-bg)), transparent)" }}
      />
      <div
        className="absolute top-0 right-0 bottom-0 w-16 pointer-events-none"
        style={{ background: "linear-gradient(to left, hsl(var(--ticker-bg)), transparent)" }}
      />
    </div>
  );
};

export default FinancialTicker;
