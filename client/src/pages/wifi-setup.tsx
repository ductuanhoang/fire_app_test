import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore } from "@/lib/store";
import { ArrowRight, Wifi, Lock, Loader2, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mock WiFi networks
const MOCK_NETWORKS = [
  { ssid: "FD_Secure_Network", strength: 100, secure: true },
  { ssid: "Guest_Access", strength: 80, secure: false },
  { ssid: "Office_WiFi_5G", strength: 90, secure: true },
  { ssid: "Warehouse_Link_A", strength: 60, secure: true },
  { ssid: "Maintenance_Net", strength: 40, secure: true },
];

export default function WifiSetupPage() {
  const [, setLocation] = useLocation();
  const login = useAppStore((state) => state.login);
  const [scanning, setScanning] = useState(true);
  const [networks, setNetworks] = useState<typeof MOCK_NETWORKS>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate scanning
    const timer = setTimeout(() => {
      setNetworks(MOCK_NETWORKS);
      setScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNetwork) return;

    // Basic validation
    const network = networks.find(n => n.ssid === selectedNetwork);
    if (network?.secure && !password) {
      setError("Password is required for secured networks");
      return;
    }

    setConnecting(true);
    setError("");

    // Simulate connection delay
    setTimeout(() => {
      setConnecting(false);
      login("New User"); // Auto-login after setup
      setLocation("/setup");
    }, 1500);
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Wifi className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-wide">Connect</h1>
          <p className="text-muted-foreground">Select a Wi-Fi network to continue setup.</p>
        </div>

        {/* Network List */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-2">
          {scanning ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-mono animate-pulse">Scanning for networks...</p>
            </div>
          ) : (
            <AnimatePresence>
              {networks.map((net, idx) => (
                <motion.button
                  key={net.ssid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => {
                    setSelectedNetwork(net.ssid);
                    setPassword("");
                    setError("");
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl border flex items-center justify-between group transition-all duration-200",
                    selectedNetwork === net.ssid 
                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                      : "bg-card border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Wifi className={cn(
                      "w-5 h-5",
                      selectedNetwork === net.ssid ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div className="flex flex-col items-start">
                      <span className={cn(
                        "font-medium",
                        selectedNetwork === net.ssid ? "text-white" : "text-gray-300"
                      )}>{net.ssid}</span>
                      {net.secure && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Secured
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedNetwork === net.ssid && (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Password Input & Connect */}
        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {selectedNetwork && networks.find(n => n.ssid === selectedNetwork)?.secure && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  autoFocus
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-2 px-2">
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
             <button
              onClick={() => {
                login("New User"); // Auto-login if skipped
                setLocation("/setup");
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 text-muted-foreground font-bold py-4 rounded-xl transition-all"
            >
              Skip
            </button>
            
            <button
              onClick={handleConnect}
              disabled={!selectedNetwork || connecting}
              className={cn(
                "flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                (!selectedNetwork || connecting) && "opacity-50 cursor-not-allowed"
              )}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span>Connect</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
