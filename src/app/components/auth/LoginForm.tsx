import { useState } from "react";
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import { InputField } from "../shared/InputField";
import { Button } from "../shared/Button";

interface LoginFormProps {
  onLogin: (email: string, pass: string) => Promise<void>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!email.includes("@")) throw new Error("Please enter a valid email");
      if (password.length < 4) throw new Error("Password is too short");

      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm animate-shake">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          placeholder="admin@nexusbank.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          layout="col"
        />
        
        <div>
          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            layout="col"
          />
          <div className="flex justify-end mt-1.5">
            <button type="button" className="text-xs text-blue-600 hover:underline font-medium">
              Forgot password?
            </button>
          </div>
        </div>
      </div>

      <Button
        className="w-full py-3 rounded-xl text-base font-semibold shadow-lg shadow-blue-200"
        icon={loading ? Loader2 : LogIn}
      >
        {loading ? "Authenticating..." : "Sign In"}
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">Security Notice</span>
        </div>
      </div>

      <p className="text-[11px] text-center text-gray-400 leading-relaxed">
        Unauthorized access is strictly prohibited. Your IP address and session data are being logged for security purposes.
      </p>
    </form>
  );
}
