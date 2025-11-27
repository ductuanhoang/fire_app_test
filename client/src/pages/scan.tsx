import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore } from "@/lib/store";
import { ScanLine, Camera, X, Keyboard, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// NOTE: This page is largely deprecated by SetupPage, but kept for fallback
export default function ScanPage() {
  const [, setLocation] = useLocation();
  const { addDevice } = useAppStore();
  const [scanning, setScanning] = useState(true);
  const [manualId, setManualId] = useState("");
  const [activeTab, setActiveTab] = useState("scan");

  const handleScanClick = () => {
    addDevice({
      name: 'New Device',
      serialNumber: 'DEV-8849-XJ',
      status: 'online'
    });
    setLocation("/home");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim().length > 0) {
      addDevice({
        name: 'New Device',
        serialNumber: manualId.toUpperCase(),
        status: 'online'
      });
      setLocation("/home");
    }
  };

  return (
    <MobileLayout className="bg-black">
      <div className="flex-1 flex flex-col relative h-full">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        
        {/* Overlay UI */}
        <div className="relative z-10 flex-1 flex flex-col p-6 h-full">
          {/* Header */}
          <div className="w-full flex justify-between items-center mt-4 mb-8">
            <button 
              onClick={() => setLocation("/home")}
              className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white font-display font-medium tracking-wider">REGISTER DEVICE</h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          <Tabs defaultValue="scan" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border border-white/10 mb-8">
              <TabsTrigger value="scan" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70">
                <Camera className="w-4 h-4 mr-2" />
                Scan QR
              </TabsTrigger>
              <TabsTrigger value="manual" className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70">
                <Keyboard className="w-4 h-4 mr-2" />
                Device ID
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 flex flex-col justify-center">
              <TabsContent value="scan" className="flex-1 flex flex-col items-center justify-center mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Scanning Frame */}
                <div 
                  onClick={handleScanClick}
                  className="relative w-64 h-64 border-2 border-white/30 rounded-3xl flex items-center justify-center overflow-hidden backdrop-blur-sm bg-white/5 mb-8 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="absolute inset-0 border-[3px] border-primary rounded-3xl opacity-50"></div>
                  
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>

                  {/* Scanning Animation */}
                  <motion.div 
                    className="absolute w-full h-1 bg-primary shadow-[0_0_15px_rgba(255,50,50,0.8)]"
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <ScanLine className="text-white/50 w-12 h-12 animate-pulse" />
                </div>

                <div className="text-center space-y-2">
                  <p className="text-white font-medium text-lg">Align QR Code</p>
                  <p className="text-white/60 text-sm max-w-[200px] mx-auto">
                    Position the device QR code within the frame to register. Tap frame to simulate scan.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="flex-1 flex flex-col justify-center mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
                  <div className="space-y-2">
                    <h3 className="text-white font-display text-xl font-bold">Enter Device ID</h3>
                    <p className="text-white/60 text-sm">
                      Locate the serial number on the back of your device unit.
                    </p>
                  </div>

                  <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-primary tracking-wider ml-1">Serial Number</label>
                      <input 
                        type="text" 
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="e.g. DEV-8849-XJ"
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-4 px-4 text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase text-lg tracking-wider"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={manualId.length < 3}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 transition-all",
                        manualId.length >= 3 
                          ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(220,38,38,0.4)]" 
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      )}
                    >
                      <span>CONNECT DEVICE</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MobileLayout>
  );
}
