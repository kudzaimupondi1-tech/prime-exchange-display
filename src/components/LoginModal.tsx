import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface Props {
  onLogin: () => void;
}

const LoginModal = ({ onLogin }: Props) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      onLogin();
      setOpen(false);
      setUsername("");
      setPassword("");
      setError("");
    } else {
      setError("Invalid credentials");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors admin-panel-surface"
      >
        <Lock className="w-3 h-3" />
        Admin
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="admin-panel-surface rounded-xl p-6 w-[320px] space-y-4"
      >
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 gold-text" />
          </div>
          <h2 className="text-sm font-bold gold-text tracking-wider uppercase">Admin Login</h2>
        </div>

        {error && (
          <p className="text-xs text-destructive text-center">{error}</p>
        )}

        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="h-9 text-sm bg-secondary border-border"
          autoFocus
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-9 text-sm bg-secondary border-border"
        />

        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 h-9 text-xs">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 h-9 text-xs font-bold tracking-wider">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
