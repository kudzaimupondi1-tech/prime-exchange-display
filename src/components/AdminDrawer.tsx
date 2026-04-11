import { useState } from "react";
import { AppState, CurrencyRate } from "@/lib/store";
import { PRESET_CURRENCIES } from "@/lib/currencies";
import { ALL_COUNTRIES, Country } from "@/lib/countries";
import { parseTreasuryPdf } from "@/lib/pdfParser";

interface Props {
  state: AppState;
  onUpdate: (state: AppState) => void;
  onClose: () => void;
}

const AdminDrawer = ({ state, onUpdate, onClose }: Props) => {
  const [tab, setTab] = useState<"rates" | "currencies" | "display" | "branding" | "settings">("rates");
  const [editRates, setEditRates] = useState<CurrencyRate[]>(() => state.currencies.map(c => ({ ...c })));
  const [feedback, setFeedback] = useState("");
  const [displayMode, setDisplayMode] = useState<"video" | "announcement">(state.displayMode || "video");
  const [announcementText, setAnnouncementText] = useState(state.announcementText || "");
  const [companyInput, setCompanyInput] = useState(state.companyName);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCountry, setCustomCountry] = useState("");
  const [customBuy, setCustomBuy] = useState("");
  const [customSell, setCustomSell] = useState("");
  const [customAgainst, setCustomAgainst] = useState("");
  const [presetAgainst, setPresetAgainst] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const info = state.companyInfo || { values: ["Relationships", "Results", "Reach", "Relevance"], vision: "", mission: "" };
  const [valuesText, setValuesText] = useState(info.values.join("\n"));
  const [visionText, setVisionText] = useState(info.vision);
  const [missionText, setMissionText] = useState(info.mission);

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2500);
  };

  const saveRates = () => {
    const cleaned = editRates.map(r => ({ ...r, buy: r.buy.trim(), sell: r.sell.trim() }));
    onUpdate({ ...state, currencies: cleaned });
    flash("Rates saved!");
  };

  const removeCurrency = (code: string, against: string) => {
    const next = editRates.filter(r => !(r.code === code && (r.against || "ZWG") === against));
    setEditRates(next);
    onUpdate({ ...state, currencies: next });
    flash(`${code} removed`);
  };

  const addPreset = (preset: typeof PRESET_CURRENCIES[0]) => {
    if (!presetAgainst) { flash("Select against currency first"); return; }
    if (editRates.find(r => r.code === preset.code && (r.against || "ZWG") === presetAgainst)) { flash(`${preset.code} already added against ${presetAgainst}`); return; }
    const newRate: CurrencyRate = { ...preset, buy: "", sell: "", against: presetAgainst };
    const next = [...editRates, newRate];
    setEditRates(next);
    onUpdate({ ...state, currencies: next });
    flash(`${preset.code} added`);
  };

  const selectCountry = (country: Country) => {
    setCustomCountry(country.code);
    setShowCountryPicker(false);
    setCountrySearch("");
  };

  const addCustom = () => {
    if (!customCode) { flash("Code required"); return; }
    if (!customCountry) { flash("Please select a country flag"); return; }
    if (!customAgainst) { flash("Please select against currency"); return; }
    if (editRates.find(r => r.code === customCode.toUpperCase() && (r.against || "ZWG") === customAgainst.toUpperCase())) { flash("Already exists against this currency"); return; }
    const country = ALL_COUNTRIES.find(c => c.code === customCountry);
    const newRate: CurrencyRate = {
      code: customCode.toUpperCase(),
      name: customName.toUpperCase() || customCode.toUpperCase(),
      flag: country?.flag || "💱",
      countryCode: customCountry.toLowerCase(),
      buy: customBuy,
      sell: customSell,
      against: customAgainst.toUpperCase(),
    };
    const next = [...editRates, newRate];
    setEditRates(next);
    onUpdate({ ...state, currencies: next });
    setCustomCode(""); setCustomName(""); setCustomCountry(""); setCustomBuy(""); setCustomSell(""); setCustomAgainst("");
    flash("Currency added");
  };

  const saveDisplay = () => {
    onUpdate({ ...state, displayMode, announcementText });
    flash("Display settings saved");
  };

  const saveCompany = () => {
    onUpdate({ ...state, companyName: companyInput.trim().toUpperCase() || "AFC BANK" });
    flash("Company name updated");
  };

  const updatePassword = () => {
    if (newPass.length < 4) { flash("Min 4 characters"); return; }
    if (newPass !== confirmPass) { flash("Passwords don't match"); return; }
    onUpdate({ ...state, adminPassword: newPass });
    setNewPass(""); setConfirmPass("");
    flash("Password updated");
  };

  const s = styles;
  const availablePresets = presetAgainst 
    ? PRESET_CURRENCIES.filter(p => !editRates.find(r => r.code === p.code && (r.against || "ZWG") === presetAgainst))
    : PRESET_CURRENCIES;
  const selectedCountry = ALL_COUNTRIES.find(c => c.code === customCountry);
  const filteredCountries = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.drawer} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <span style={s.headerTitle}>ADMIN PANEL</span>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        {/* Feedback */}
        {feedback && <div style={s.feedback}>{feedback}</div>}

        {/* Tabs */}
        <div style={s.tabBar}>
          {(["rates", "currencies", "display", "branding", "settings"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={s.content}>
          {tab === "rates" && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  ...s.primaryBtn, 
                  cursor: "pointer", 
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%", 
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "15px",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="12"></line><line x1="15" y1="15" x2="12" y2="12"></line></svg>
                  Upload PDF Rates
                  <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onClick={(e) => {
                      (e.target as HTMLInputElement).value = ""; // allow re-upload same file
                    }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        flash("Parsing PDF...");
                        const result = await parseTreasuryPdf(file);
                        
                        let added = 0;
                        let updated = 0;
                        const next = [...editRates];
                        
                        result.forEach(r => {
                          const existingIndex = next.findIndex(x => x.code === r.code && x.against === r.against);
                          if (existingIndex >= 0) {
                            next[existingIndex] = { ...next[existingIndex], buy: r.buy, sell: r.sell };
                            updated++;
                          }
                        });
                        
                        setEditRates(next);
                        // Save immediately for convenience
                        onUpdate({ ...state, currencies: next });
                        flash(`Success. Updated ${updated}, Added ${added} rates.`);
                      } catch (err) {
                        flash("Failed to parse PDF");
                        console.error(err);
                      }
                    }}
                  />
                </label>
              </div>

              {editRates.map((r, i) => (
                <div key={`${r.code}-${r.against || "ZWG"}`} style={s.rateRow}>
                  <span style={s.rateLabel} title={r.name}>{r.flag} {r.code}</span>
                  <select
                    value={r.against || "ZWG"}
                    onChange={e => {
                      const next = [...editRates];
                      next[i] = { ...next[i], against: e.target.value };
                      setEditRates(next);
                    }}
                    style={{ ...s.input, padding: "8px 2px" }}
                  >
                    <option value="ZWG">ZWG</option>
                    <option value="USD">USD</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                  <input
                    inputMode="decimal"
                    value={r.buy}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault();
                    }}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9.]/g, '');
                      if ((val.match(/\./g) || []).length > 1) {
                         val = val.substring(0, val.lastIndexOf('.'));
                      }
                      const next = [...editRates];
                      next[i] = { ...next[i], buy: val };
                      setEditRates(next);
                    }}
                    placeholder="Buy"
                    style={s.input}
                  />
                  <input
                    inputMode="decimal"
                    value={r.sell}
                    onKeyPress={(e) => {
                      if (!/[0-9.]/.test(e.key)) e.preventDefault();
                    }}
                    onChange={e => {
                      let val = e.target.value.replace(/[^0-9.]/g, '');
                      if ((val.match(/\./g) || []).length > 1) {
                         val = val.substring(0, val.lastIndexOf('.'));
                      }
                      const next = [...editRates];
                      next[i] = { ...next[i], sell: val };
                      setEditRates(next);
                    }}
                    placeholder="Sell"
                    style={s.input}
                  />
                </div>
              ))}
              <button onClick={saveRates} style={s.primaryBtn}>SAVE RATES</button>
            </div>
          )}

          {tab === "currencies" && (
            <div>
              <p style={s.sectionTitle}>Active Currencies</p>
              {editRates.map(r => (
                <div key={`${r.code}-${r.against || "ZWG"}`} style={s.currRow}>
                  <span style={s.rateLabel}>{r.flag} {r.code} (vs {r.against || "ZWG"}) — {r.name}</span>
                  <button onClick={() => removeCurrency(r.code, r.against || "ZWG")} style={s.removeBtn}>Remove</button>
                </div>
              ))}



              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
                <p style={{ ...s.sectionTitle, marginTop: 0, marginBottom: 0 }}>Preset Currencies ({availablePresets.length})</p>
                <select value={presetAgainst} onChange={e => setPresetAgainst(e.target.value)} style={{ ...s.input, width: "110px", padding: "4px 8px" }}>
                  <option value="" disabled>vs...</option>
                  <option value="ZWG">vs ZWG</option>
                  <option value="USD">vs USD</option>
                  <option value="ZAR">vs ZAR</option>
                </select>
              </div>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {availablePresets.map(p => (
                  <div key={p.code} style={s.currRow}>
                    <span style={s.rateLabel}>{p.flag} {p.code} — {p.name}</span>
                    <button onClick={() => addPreset(p)} style={s.addBtn}>Add</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "display" && (
            <div>
              <p style={s.sectionTitle}>Content Mode</p>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                  onClick={() => setDisplayMode("video")}
                  style={{ ...s.primaryBtn, marginTop: 0, background: displayMode === "video" ? "linear-gradient(180deg, #d4af37, #b8962e)" : "rgba(255,255,255,0.05)", color: displayMode === "video" ? "#06101d" : "#fff" }}
                >
                  VIDEO
                </button>
                <button
                  onClick={() => setDisplayMode("announcement")}
                  style={{ ...s.primaryBtn, marginTop: 0, background: displayMode === "announcement" ? "linear-gradient(180deg, #d4af37, #b8962e)" : "rgba(255,255,255,0.05)", color: displayMode === "announcement" ? "#06101d" : "#fff" }}
                >
                  ANNOUNCEMENT
                </button>
              </div>

              {displayMode === "announcement" && (
                <>
                  <p style={s.sectionTitle}>Announcement Text</p>
                  <textarea
                    value={announcementText}
                    onChange={e => setAnnouncementText(e.target.value)}
                    placeholder="Enter announcement text here..."
                    style={{ ...s.input, width: "100%", height: "120px", resize: "vertical", marginBottom: "12px", fontFamily: "Inter, sans-serif" }}
                  />
                </>
              )}
              <button onClick={saveDisplay} style={s.primaryBtn}>SAVE DISPLAY SETTINGS</button>
            </div>
          )}

          {tab === "branding" && (
            <div>
              <p style={s.sectionTitle}>Our Values (one per line)</p>
              <textarea
                value={valuesText}
                onChange={e => setValuesText(e.target.value)}
                placeholder={"Relationships\nResults\nReach\nRelevance"}
                style={{ ...s.input, width: "100%", height: "100px", resize: "vertical", marginBottom: "8px", fontFamily: "Inter, sans-serif" }}
              />

              <p style={s.sectionTitle}>Our Vision</p>
              <textarea
                value={visionText}
                onChange={e => setVisionText(e.target.value)}
                placeholder="Enter vision statement..."
                style={{ ...s.input, width: "100%", height: "80px", resize: "vertical", marginBottom: "8px", fontFamily: "Inter, sans-serif" }}
              />

              <p style={s.sectionTitle}>Our Mission</p>
              <textarea
                value={missionText}
                onChange={e => setMissionText(e.target.value)}
                placeholder="Enter mission statement..."
                style={{ ...s.input, width: "100%", height: "80px", resize: "vertical", marginBottom: "8px", fontFamily: "Inter, sans-serif" }}
              />

              <button onClick={() => {
                onUpdate({
                  ...state,
                  companyInfo: {
                    values: valuesText.split("\n").map(v => v.trim()).filter(Boolean),
                    vision: visionText.trim(),
                    mission: missionText.trim(),
                  }
                });
                flash("Branding saved!");
              }} style={s.primaryBtn}>SAVE BRANDING</button>
            </div>
          )}

          {tab === "settings" && (
            <div>
              <p style={s.sectionTitle}>Change Password</p>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="New Password"
                style={{ ...s.input, width: "100%", marginBottom: "8px" }}
              />
              <input
                type="password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                placeholder="Confirm Password"
                style={{ ...s.input, width: "100%", marginBottom: "8px" }}
              />
              <button onClick={updatePassword} style={s.primaryBtn}>UPDATE PASSWORD</button>
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={onClose} style={s.logoutBtn}>LOGOUT & CLOSE</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, zIndex: 10000,
    background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "flex-end",
  },
  drawer: {
    width: "420px", maxWidth: "90vw", height: "100%",
    background: "#06101d",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    boxShadow: "-4px 0 30px rgba(0,0,0,0.6)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(212,175,55,0.2)",
  },
  headerTitle: {
    fontFamily: "Montserrat, Arial, sans-serif",
    fontWeight: 700, fontSize: "14px", color: "#d4af37",
    letterSpacing: "3px",
  },
  closeBtn: {
    background: "none", border: "none", color: "rgba(255,255,255,0.5)",
    fontSize: "18px", cursor: "pointer", padding: "4px",
  },
  feedback: {
    background: "rgba(212,175,55,0.15)", color: "#d4af37",
    padding: "8px 20px", fontSize: "13px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  tabBar: {
    display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  tab: {
    flex: 1, padding: "10px 0", background: "none", border: "none",
    color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 700,
    letterSpacing: "1px", cursor: "pointer",
    fontFamily: "Montserrat, Arial, sans-serif",
    borderBottom: "2px solid transparent",
  },
  tabActive: {
    color: "#d4af37",
    borderBottomColor: "#d4af37",
  },
  content: {
    flex: 1, overflowY: "auto", padding: "16px 20px",
  },
  rateRow: {
    display: "grid", gridTemplateColumns: "85px 65px 1fr 1fr", gap: "4px",
    alignItems: "center", marginBottom: "8px",
  },
  rateLabel: {
    fontSize: "12px", fontWeight: 700, color: "#d4af37",
    fontFamily: "monospace", whiteSpace: "nowrap",
  },
  input: {
    background: "#0d1b2a", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "6px", padding: "8px 10px",
    color: "#fff", fontSize: "13px",
    fontFamily: "monospace", outline: "none",
  },
  primaryBtn: {
    width: "100%", padding: "10px", marginTop: "8px",
    background: "linear-gradient(180deg, #d4af37, #b8962e)",
    color: "#06101d", border: "none", borderRadius: "6px",
    fontFamily: "Montserrat, Arial, sans-serif",
    fontWeight: 700, fontSize: "12px", letterSpacing: "2px",
    cursor: "pointer",
  },
  sectionTitle: {
    color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600,
    letterSpacing: "2px", marginBottom: "10px",
    fontFamily: "Montserrat, Arial, sans-serif",
    textTransform: "uppercase" as const,
  },
  currRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  removeBtn: {
    background: "rgba(220,50,50,0.15)", color: "#ef4444",
    border: "1px solid rgba(220,50,50,0.3)", borderRadius: "4px",
    padding: "4px 10px", fontSize: "11px", cursor: "pointer",
    fontWeight: 600,
  },
  addBtn: {
    background: "rgba(212,175,55,0.15)", color: "#d4af37",
    border: "1px solid rgba(212,175,55,0.3)", borderRadius: "4px",
    padding: "4px 10px", fontSize: "11px", cursor: "pointer",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "12px", background: "none",
    border: "none", borderTop: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 700,
    letterSpacing: "2px", cursor: "pointer",
    fontFamily: "Montserrat, Arial, sans-serif",
  },
};

export default AdminDrawer;