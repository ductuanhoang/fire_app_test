import { useState } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore } from "@/lib/store";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const login = useAppStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      login(username);
      setLocation("/home");
    }
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Flame size={40} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold tracking-wide">FIRE <span className="text-primary">DYNAMICS</span></h1>
            <p className="text-muted-foreground text-sm tracking-widest uppercase mt-1">Advanced Suppression Systems</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() => setLocation("/create-account")}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all border border-white/10"
          >
            Create Account
          </button>

          <div className="text-center">
            <button type="button" className="text-sm text-muted-foreground hover:text-white transition-colors">
              Reset Password
            </button>
          </div>
        </form>

        {/* Social Auth Mock */}
        <div className="w-full space-y-4 mt-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-white/10"></div>
            <span className="relative bg-background px-4 text-xs text-muted-foreground uppercase">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-3 bg-white rounded-xl text-black hover:bg-gray-200 transition-colors">
              <span className="font-bold">Google</span>
            </button>
            <button className="flex items-center justify-center py-3 bg-white rounded-xl text-black hover:bg-gray-200 transition-colors">
              <span className="font-bold">Apple</span>
            </button>
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
