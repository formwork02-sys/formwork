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
      const success = await api.verifyPassword(password);
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-4 border border-black/10 rounded-xl focus:outline-none focus:border-black transition-colors text-center"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white p-4 rounded-xl font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "확인 중..." : "접속하기"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
