import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNav } from "@/components/bottom-nav";
import { useAppStore } from "@/lib/store";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Moon,
  Mail,
  Smartphone
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useAppStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-6 pb-2">
          <h1 className="text-xl font-display font-bold tracking-wide">ACCOUNT</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-8">
          
          {/* Profile Section */}
          <section className="flex flex-col items-center py-6">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/50 shadow-[0_0_30px_rgba(220,38,38,0.2)] mb-4">
              <User size={48} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold">{currentUser?.name || "User"}</h2>
            <p className="text-muted-foreground text-sm">Fire Safety Officer</p>
          </section>

          {/* Settings Groups */}
          <div className="space-y-6">
            
            {/* General */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider ml-1">General</h3>
              <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Bell size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Push Notifications</span>
                  </div>
                  <Switch 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Moon size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <Switch 
                    checked={darkModeEnabled} 
                    onCheckedChange={setDarkModeEnabled} 
                  />
                </div>

              </div>
            </div>

            {/* Account */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider ml-1">Account & Security</h3>
              <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                
                <button className="w-full flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Mail size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Email Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <Shield size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Security & Privacy</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>

              </div>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-muted-foreground tracking-wider ml-1">Support</h3>
              <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <HelpCircle size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Help Center</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </button>

              </div>
            </div>

          </div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-xl border border-destructive/30 text-destructive font-bold hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>

          <div className="text-center pb-4">
            <p className="text-[10px] text-muted-foreground font-mono">
              Fire Dynamics App v1.0.2 (Build 4492)
            </p>
          </div>

        </div>

        <BottomNav />
      </div>
    </MobileLayout>
  );
}