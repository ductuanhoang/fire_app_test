import { useLocation } from "wouter";
import { Home, Bell, Map, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Map, label: "Map", path: "/map" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <div className="h-auto min-h-[4rem] bg-card/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 z-50 mt-auto shrink-0 pb-[env(safe-area-inset-bottom)] pt-1">
      {navItems.map((item) => {
        const isActive = location.startsWith(item.path);
        return (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-white"
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
