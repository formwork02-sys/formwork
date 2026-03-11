import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("site_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem("site_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
            <Lock size={32} />
          </div>
        </div>
        
        <h1 className="text-[34.5px] font-black mb-1 tracking-normal">formwork</h1>
        <p className="text-black/40 text-xs mb-8 uppercase tracking-normal font-bold">Protected Access</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={`w-full px-6 py-4 bg-brand-gray rounded-xl border-2 transition-all outline-none text-center text-lg font-bold tracking-normal ${
                error ? "border-red-500 animate-shake" : "border-transparent focus:border-black"
              }`}
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-xs font-bold tracking-normal">Incorrect password. Please try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-black text-white rounded-xl font-bold tracking-normal hover:bg-black/90 transition-all active:scale-[0.98]"
          >
            Enter Site
          </button>
        </form>
        
        <p className="mt-12 text-[10px] text-black/20 uppercase tracking-normal font-bold">
          &copy; 2026 formwork. All Rights Reserved.
        </p>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
