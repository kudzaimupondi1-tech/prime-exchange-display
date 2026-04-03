import { useState, useRef } from "react";
import { ExchangeRate } from "@/lib/rateStore";
import { parseFile } from "@/lib/fileParser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Upload, LogOut, Check, AlertCircle } from "lucide-react";

interface Props {
  rates: ExchangeRate[];
  onUpdate: (rates: ExchangeRate[]) => void;
  onLogout: () => void;
}

const AdminPanel = ({ rates, onUpdate, onLogout }: Props) => {
  const [editRates, setEditRates] = useState<ExchangeRate[]>(() =>
    rates.map((r) => ({ ...r }))
  );
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFieldChange = (index: number, field: "buy" | "sell", value: string) => {
    setEditRates((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = () => {
    const cleaned = editRates.map((r) => ({
      ...r,
      buy: r.buy.trim() || "—",
      sell: r.sell.trim() || "—",
    }));
    onUpdate(cleaned);
    showFeedback("success", "Rates updated successfully");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseFile(file);
      onUpdate(parsed);
      setEditRates(parsed.map((r) => ({ ...r })));
      showFeedback("success", `Rates imported from ${file.name}`);
    } catch (err: any) {
      showFeedback("error", err.message || "Failed to parse file");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-3 right-3 z-50 px-3 py-1.5 rounded-lg text-xs font-semibold admin-panel-surface gold-text hover:opacity-90 transition-opacity"
      >
        Admin ▼
      </button>
    );
  }

  return (
    <div className="fixed top-3 right-3 z-50 w-[340px] admin-panel-surface rounded-xl p-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold gold-text tracking-wider uppercase">Admin Panel</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setCollapsed(true)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs font-medium ${feedback.type === "success" ? "bg-rate-buy/10 text-rate-buy" : "bg-destructive/10 text-destructive"}`}>
          {feedback.type === "success" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {feedback.msg}
        </div>
      )}

      {/* Rate Inputs */}
      <div className="space-y-2 mb-4">
        {editRates.map((rate, i) => (
          <div key={rate.currency} className="grid grid-cols-[60px_1fr_1fr] gap-2 items-center">
            <span className="text-xs font-bold gold-text font-mono">{rate.flag} {rate.currency}</span>
            <Input
              value={rate.buy}
              onChange={(e) => handleFieldChange(i, "buy", e.target.value)}
              placeholder="Buy"
              className="h-8 text-xs bg-secondary border-border font-mono"
            />
            <Input
              value={rate.sell}
              onChange={(e) => handleFieldChange(i, "sell", e.target.value)}
              placeholder="Sell"
              className="h-8 text-xs bg-secondary border-border font-mono"
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full mb-3 h-8 text-xs font-bold tracking-wider" size="sm">
        Update Rates
      </Button>

      {/* File Upload */}
      <div className="border border-dashed border-border rounded-lg p-3 mb-3 text-center">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.json,.xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 w-full text-muted-foreground hover:text-foreground transition-colors text-xs"
        >
          <Upload className="w-3 h-3" />
          Import CSV / JSON
        </button>
      </div>

      <Button onClick={onLogout} variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-destructive" size="sm">
        <LogOut className="w-3 h-3 mr-1" /> Logout
      </Button>
    </div>
  );
};

export default AdminPanel;
