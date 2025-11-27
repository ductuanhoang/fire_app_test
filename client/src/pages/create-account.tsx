import { useState } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore } from "@/lib/store";
import { Flame, User, Mail, Lock, ArrowLeft } from "lucide-react";

export default function CreateAccountPage() {
  const [, setLocation] = useLocation();
  const login = useAppStore((state) => state.login);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      // In a real app, we would create the account here
      login(name); // Auto-login the new user
      setLocation("/wifi-setup");
    } else {
      setError("Please fill in all fields");
    }
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 py-8 overflow-y-auto">
        
        {/* Header */}
        <div className="w-full flex items-center justify-start">
          <button 
            onClick={() => setLocation("/")} 
            className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <Flame size={32} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold tracking-wide">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Join Fire Dynamics today</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateAccount} className="w-full space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-4"
          >
            Create Account
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => setLocation("/")}
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Log In
              </button>
            </p>
          </div>
        </form>

        {/* Social Auth Mock */}
        <div className="w-full space-y-4 mt-2 pb-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-white/10"></div>
            <span className="relative bg-background px-4 text-xs text-muted-foreground uppercase">Or continue with</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center py-3 bg-white rounded-xl text-black hover:bg-gray-200 transition-colors">
              <span className="font-bold">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center py-3 bg-white rounded-xl text-black hover:bg-gray-200 transition-colors">
              <span className="font-bold">Apple</span>
            </button>
          </div>
        </div>

      </div>
    </MobileLayout>
  );
}
