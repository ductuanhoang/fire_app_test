import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNav } from "@/components/bottom-nav";
import { Shield, Battery, Activity, Settings, Power, AlertTriangle, Flame, Plus, LogOut, MapPin, Wind, CloudFog, ArrowLeft, Navigation, Droplet, Pencil, ArrowUpFromLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import deviceImage from '@assets/FD_RD_1_1763945450204.jpg';
import { useLocation, useRoute } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [, params] = useRoute("/device/:id");
  const [, setLocation] = useLocation();
  const { devices, updateDevice, removeDevice } = useAppStore();
  
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const [isHeightOpen, setIsHeightOpen] = useState(false);
  const [newHeight, setNewHeight] = useState("");

  const device = devices.find(d => d.id === params?.id);
  
  if (!device) {
    return (
      <MobileLayout className="bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">Device Not Found</h2>
          <button onClick={() => setLocation('/home')} className="mt-4 text-primary">Go Home</button>
        </div>
      </MobileLayout>
    );
  }

  const isAuto = device.mode === 'automatic';

  const toggleFireStatus = () => {
    updateDevice(device.id, { 
      fireStatus: device.fireStatus === 'safe' ? 'active' : 'safe',
      status: device.fireStatus === 'safe' ? 'emergency' : 'online'
    });
  };

  const setMode = (mode: 'automatic' | 'manual') => {
    updateDevice(device.id, { mode });
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-6 gap-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mt-4">
          <button onClick={() => setLocation('/home')} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          
          <div>
            <h1 className="text-xl font-display font-bold tracking-wide uppercase">{device.name}</h1>
            <p className="text-xs text-muted-foreground font-mono text-center mt-1 opacity-90">{device.serialNumber}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", 
                device.status === 'online' ? "bg-green-500" : 
                device.status === 'pre-soaking' ? "bg-blue-500" : 
                device.status === 'warning' ? "bg-yellow-500" :
                "bg-red-500"
              )}></span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{device.status.replace('-', ' ')}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-full bg-card border border-white/5 text-muted-foreground hover:text-white transition-colors outline-none focus:ring-2 focus:ring-primary/50">
                <Settings size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-white/10 text-foreground backdrop-blur-xl">
              <DropdownMenuLabel className="text-xs font-mono uppercase text-muted-foreground">Device Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-white/10 focus:text-white"
                onClick={() => {
                  setNewName(device.name);
                  setIsRenameOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Rename Device</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer focus:bg-white/10 focus:text-white"
                onClick={() => {
                  setNewHeight(device.height?.toString() || "");
                  setIsHeightOpen(true);
                }}
              >
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                <span>Edit Installation Height</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                <Activity className="mr-2 h-4 w-4" />
                <span>Diagnostics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={() => {
                  removeDevice(device.id);
                  setLocation('/home');
                }}
                className="cursor-pointer focus:bg-destructive/20 focus:text-destructive text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Remove Device</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Device Visualization & Status */}
        <section className="flex gap-4 h-48">
           <div className={cn(
             "w-[40%] relative rounded-3xl overflow-hidden shadow-xl flex items-center justify-center shrink-0 border transition-all duration-300",
             device.status === 'online' && "bg-card border-white/5",
             device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "bg-yellow-500/10 border-yellow-500/50" : "bg-blue-500/10 border-blue-500/50 animate-pulse"),
             device.status === 'warning' && "bg-yellow-500/10 border-yellow-500/50",
             device.status === 'emergency' && "bg-destructive/10 border-destructive/50 animate-pulse",
             device.status === 'offline' && "bg-white/5 border-white/10 opacity-75"
           )}>
             {/* Spotlight Gradient to illuminate the device for multiply blend mode */}
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.7)_0%,transparent_70%)] mix-blend-normal" />
             
             <img 
               src={deviceImage} 
               alt="Device" 
               className={cn(
                 "w-full h-full object-cover hover:scale-105 transition-transform duration-700 mix-blend-multiply filter brightness-125 contrast-125 relative z-10",
                 device.status === 'offline' && "grayscale opacity-80"
               )}
             />
           </div>

           <div className="flex-1 min-w-0">
            <div 
              className={cn(
                "w-full h-full p-4 rounded-2xl border transition-all duration-300 group flex flex-col justify-between",
                device.status === 'online' && "bg-card border-white/5",
                device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "bg-yellow-500/10 border-yellow-500/50" : "bg-blue-500/10 border-blue-500/50 animate-pulse"),
                device.status === 'warning' && "bg-yellow-500/10 border-yellow-500/50",
                device.status === 'emergency' && "bg-destructive/10 border-destructive/50 animate-pulse",
                device.status === 'offline' && "bg-white/5 border-white/10 opacity-75"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/5",
                  device.status === 'online' && "text-green-500",
                  device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "text-yellow-400" : "text-blue-500"),
                  device.status === 'warning' && "text-yellow-400",
                  device.status === 'emergency' && "text-red-500",
                  device.status === 'offline' && "text-gray-500"
                )}>
                  {device.status === 'online' && <Shield size={20} />}
                  {device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? <AlertTriangle size={20} /> : <Droplet size={20} className="fill-blue-500" />)}
                  {device.status === 'warning' && <AlertTriangle size={20} />}
                  {device.status === 'emergency' && <Flame size={20} />}
                  {device.status === 'offline' && <Shield size={20} />}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className={cn("font-bold text-sm leading-tight", 
                    device.status === 'emergency' && "text-destructive",
                    device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "text-yellow-400" : "text-blue-400"),
                    device.status === 'warning' && "text-yellow-400"
                  )}>
                    {device.status === 'online' && "SYSTEM SECURE"}
                    {device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "PRE-SOAKING REC." : "PRE-SOAKING ACTIVE")}
                    {device.status === 'warning' && "SYSTEM WARNING"}
                    {device.status === 'emergency' && "FIRE DETECTED"}
                    {device.status === 'offline' && "SYSTEM OFFLINE"}
                  </h3>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-1 line-clamp-3">
                    {device.status === 'online' && "No anomalies detected."}
                    {device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "Manual activation recommended." : "System is wetting perimeter.")}
                    {device.status === 'warning' && "Maintenance required."}
                    {device.status === 'emergency' && (
                      device.fireStatus === 'active' || isAuto 
                        ? "Extinguishing fire..." 
                        : "Immediate action required."
                    )}
                    {device.status === 'offline' && "Device unreachable."}
                  </p>
                </div>
              </div>

              {/* Manual Activation Button inside Status Card */}
              {!isAuto && (device.status === 'emergency' || device.status === 'pre-soaking') && (
                 <button 
                    onClick={() => updateDevice(device.id, {
                      fireStatus: device.fireStatus === 'active' ? 'warning' : 'active'
                    })}
                    className={cn(
                      "w-full py-2 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all animate-pulse mt-2",
                      device.fireStatus === 'active'
                        ? (device.status === 'pre-soaking' ? "bg-blue-500 hover:bg-blue-600 shadow-blue-900/20" : "bg-green-500 hover:bg-green-600 shadow-green-900/20")
                        : (device.status === 'pre-soaking' ? "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-900/20" : "bg-destructive hover:bg-destructive/90 shadow-red-900/20")
                    )}
                  >
                    {device.fireStatus === 'active' 
                      ? "DEACTIVATE"
                      : "ACTIVATE"
                    }
                  </button>
              )}
            </div>
           </div>
        </section>

        {/* Main Mode Switch */}
        <section className="space-y-2">
          <h2 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Operation Mode</h2>
          <div className={cn(
            "p-1 bg-card rounded-xl flex border border-white/5 relative h-12",
            device.status === 'offline' && "opacity-50 grayscale"
          )}>
            {/* Sliding Background */}
            <motion.div 
              className={cn(
                "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-lg z-0",
                isAuto ? "left-1 bg-status-auto" : "left-[calc(50%+2px)] bg-status-manual",
                device.status === 'offline' && "bg-gray-500"
              )}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            
            <button 
              disabled={device.status === 'offline'}
              onClick={() => setMode('automatic')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 relative z-10 transition-colors duration-300",
                isAuto ? "text-black" : "text-muted-foreground",
                device.status === 'offline' && "cursor-not-allowed"
              )}
            >
              <Shield size={14} />
              <span className="font-bold text-xs tracking-wide">AUTOMATIC</span>
            </button>
            
            <button 
              disabled={device.status === 'offline'}
              onClick={() => setMode('manual')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 relative z-10 transition-colors duration-300",
                !isAuto ? "text-black" : "text-muted-foreground",
                device.status === 'offline' && "cursor-not-allowed"
              )}
            >
              <Power size={14} />
              <span className="font-bold text-xs tracking-wide">MANUAL</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground h-3">
            {device.status === 'offline' 
              ? "System is offline. Mode selection unavailable."
              : (isAuto 
                  ? "System will automatically discharge upon fire detection." 
                  : "Manual authorization required for discharge."
                )
            }
          </p>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-3">
          {/* Battery Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <Battery className={cn("w-4 h-4", device.batteryLevel > 20 ? "text-green-400" : "text-red-500")} />
              <span className="font-mono text-lg font-bold">{device.batteryLevel}%</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-green-400" style={{ width: `${device.batteryLevel}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">Battery Level</span>
          </div>

          {/* Pressure Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <Droplet className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span className="font-mono text-lg font-bold">{device.pressureLevel} <span className="text-[9px] text-muted-foreground">PSI</span></span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-blue-400" style={{ width: `${device.pressureLevel/1.2}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">Pressure</span>
          </div>

          {/* CO2 Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <Wind className={cn("w-4 h-4", device.co2Level > 1000 ? "text-yellow-500" : "text-cyan-400")} />
              <span className="font-mono text-lg font-bold">{device.co2Level} <span className="text-[9px] text-muted-foreground">PPM</span></span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-cyan-400" style={{ width: `${Math.min((device.co2Level / 2000) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">CO2 Level</span>
          </div>

          {/* Particulate Matter Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <CloudFog className={cn("w-4 h-4", device.particulateMatter > 50 ? "text-orange-500" : "text-purple-400")} />
              <span className="font-mono text-lg font-bold">{device.particulateMatter} <span className="text-[9px] text-muted-foreground">µg</span></span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-purple-400" style={{ width: `${Math.min(device.particulateMatter, 100)}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">PM 2.5</span>
          </div>

          {/* Height Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-lg font-bold">{device.height || 0} <span className="text-[9px] text-muted-foreground">FT</span></span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.min(((device.height || 0) / 20) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">Height</span>
          </div>

          {/* Wind Speed & Direction Card */}
          <div className="glass-panel p-2.5 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <div 
                className="transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${device.windDirection}deg)` }}
              >
                 <Navigation className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              </div>
              <span className="font-mono text-lg font-bold">{device.windSpeed} <span className="text-[9px] text-muted-foreground">MPH</span></span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden my-0.5">
              <div className="h-full bg-cyan-400" style={{ width: `${Math.min((device.windSpeed / 30) * 100, 100)}%` }}></div>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide">Wind Dir ({device.windDirection}°)</span>
          </div>
        </section>
      </div>
      <BottomNav />
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Device</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter a new name for this device.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              className="bg-white/5 border-white/10 text-white"
              placeholder="Device Name"
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsRenameOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button onClick={() => {
              updateDevice(device.id, { name: newName });
              setIsRenameOpen(false);
            }} className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Height Dialog */}
      <Dialog open={isHeightOpen} onOpenChange={setIsHeightOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Installation Height</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the new height in feet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <Input 
                type="number"
                value={newHeight} 
                onChange={(e) => setNewHeight(e.target.value)} 
                className="bg-white/5 border-white/10 text-white pr-12"
                placeholder="Height"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">FT</span>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsHeightOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button onClick={() => {
              const height = parseInt(newHeight);
              if (!isNaN(height)) {
                updateDevice(device.id, { height });
              }
              setIsHeightOpen(false);
            }} className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
