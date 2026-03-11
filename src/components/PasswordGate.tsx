import { useState, useEffect, ReactNode, FormEvent } from "react";
import { api } from "../services/api";
import { motion } from "motion/react";

interface PasswordGateProps {
  children: ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("site_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const trimmedPassword = password.trim();
      const success = await api.verifyPassword(trimmedPassword);
      if (success) {
        localStorage.setItem("site_auth", "true");
        setIsAuthenticated(true);
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      setError("연결 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated === null) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-black mb-4 tracking-tighter">formwork</h1>
        <p className="text-black/40 text-sm mb-8">
          이 사이트는 비공개로 설정되어 있습니다.<br />
          접속을 위해 비밀번호를 입력해주세요.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full p-5 bg-brand-gray border-none rounded-2xl focus:ring-2 focus:ring-black/5 transition-all text-center text-lg font-mono tracking-widest"
              autoFocus
            />
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white p-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/10"
          >
            {isLoading ? "확인 중..." : "Enter Site"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
