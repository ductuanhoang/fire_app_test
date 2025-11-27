import { useState, useRef } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore, Device } from "@/lib/store";
import { ArrowLeft, MapPin, Navigation, Plus, Minus, Pencil, Lock, Droplet, Flame } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import generatedImage from '@assets/generated_images/satellite_view_of_a_suburban_property.png';
import warehouseImage from '@assets/image_1764111692533.png';
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/bottom-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCATION_IMAGES: Record<string, string> = {
  'loc-1': generatedImage,
  'loc-2': warehouseImage
};

export default function LocationPage() {
  const [, setLocation] = useLocation();
  const { locations, devices, updateDevice } = useAppStore();
  
  // For demo, just use the first location's address or ID
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0]?.id || "");
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));

  const handleDragEnd = (event: any, info: any, id: string) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    
    // Find the device to get its starting position
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    const startX = device.x ?? 50;
    const startY = device.y ?? 50;
    
    // Calculate delta in percentage
    // info.offset contains the drag distance in pixels (screen coordinates)
    // rect.width/height are the scaled dimensions of the map container
    const deltaX = (info.offset.x / rect.width) * 100;
    const deltaY = (info.offset.y / rect.height) * 100;
    
    // Calculate new position preserving the grab offset
    const newX = startX + deltaX;
    const newY = startY + deltaY;
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, newX));
    const clampedY = Math.max(0, Math.min(100, newY));
    
    updateDevice(id, { x: clampedX, y: clampedY });
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Map Interface - Full Screen Background */}
        <div className="absolute inset-0 bg-black/50 overflow-hidden z-0">
          {/* Map Container - Scalable & Draggable */}
          <motion.div 
            ref={mapRef}
            className="w-full h-full relative touch-none cursor-grab active:cursor-grabbing"
            animate={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag
            dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
          >
            <img 
              src={LOCATION_IMAGES[selectedLocationId] || generatedImage} 
              alt="Satellite View" 
              className="w-full h-full object-cover opacity-60 grayscale-[0.3] pointer-events-none"
            />
            {/* Draggable Pins */}
            {devices
              .filter(device => device.locationId === selectedLocationId)
              .map((device: Device) => (
              <motion.div
                key={`${device.id}-${device.x}-${device.y}`}
                drag={isEditing}
                dragMomentum={false}
                onPointerDown={(e) => e.stopPropagation()}
                onDragEnd={(e, info) => handleDragEnd(e, info, device.id)}
                onTap={() => !isEditing && setLocation(`/device/${device.id}`)}
                initial={{ left: `${device.x || 50}%`, top: `${device.y || 50}%` }}
                animate={{ left: `${device.x || 50}%`, top: `${device.y || 50}%` }}
                className={cn(
                  "absolute w-12 h-12 -ml-6 -mt-12 touch-none z-30 group transition-colors",
                  isEditing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                )}
              >
                <div className="relative flex flex-col items-center">
                  <div className="bg-card/90 backdrop-blur px-2 py-1 rounded text-[10px] font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {device.name}
                  </div>
                  
                  {/* 40ft Radius Ring */}
                  <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-[3px] border-dotted rounded-full pointer-events-none transition-colors",
                    device.status === 'pre-soaking' ? "border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : 
                    device.status === 'emergency' ? "border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                    "border-primary/60 shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                  )}>
                    {device.status === 'pre-soaking' && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-blue-500 origin-left shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                        style={{ top: '50%', left: '50%', marginTop: '-1px' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                      >
                        {/* Optional: Tip glow */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-200 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
                      </motion.div>
                    )}
                    {device.status === 'emergency' && (
                      <motion.div
                        className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-red-500 origin-left shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                        style={{ top: '50%', left: '50%', marginTop: '-1px' }}
                        animate={{ rotate: [-7.5, 7.5, -7.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {/* Tip glow */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-200 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />
                      </motion.div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                      <Pencil size={8} />
                    </div>
                  )}

                  {device.status === 'pre-soaking' ? (
                    <Droplet
                      className={cn(
                        "w-8 h-8 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] text-blue-500",
                        isEditing && "animate-bounce"
                      )}
                      fill="currentColor"
                    />
                  ) : device.status === 'emergency' ? (
                    <Flame
                      className={cn(
                        "w-8 h-8 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] text-red-500",
                        isEditing && "animate-bounce"
                      )}
                      fill="currentColor"
                    />
                  ) : (
                    <MapPin 
                      className={cn(
                        "w-8 h-8 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                        device.status === 'online' && "text-green-500",
                        device.status === 'warning' && "text-yellow-500",
                        // device.status === 'emergency' handled above
                        // device.status === 'pre-soaking' handled above
                        device.status === 'offline' && "text-gray-500",
                        isEditing && "animate-bounce"
                      )} 
                      fill="currentColor" 
                    />
                  )}
                  <div className="w-2 h-1 bg-black/50 rounded-full blur-[2px]" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Zoom Controls */}
          <div className={cn(
            "absolute right-6 flex flex-col gap-2 z-20 transition-all duration-300",
            isEditing ? "bottom-6" : "bottom-28"
          )}>
            <button 
              onClick={handleZoomIn} 
              disabled={zoom >= 3}
              className="p-3 bg-card/80 backdrop-blur border border-white/10 rounded-full text-foreground shadow-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Plus size={24} />
            </button>
            <button 
              onClick={handleZoomOut} 
              disabled={zoom <= 1}
              className="p-3 bg-card/80 backdrop-blur border border-white/10 rounded-full text-foreground shadow-xl hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Minus size={24} />
            </button>
          </div>

          {/* Instructions Overlay */}
          {isEditing && (
          <div className="absolute bottom-6 left-6 right-6 pointer-events-none z-30 flex justify-center">
             <div className="bg-card/90 backdrop-blur-md border border-white/10 py-2 px-4 rounded-full flex items-center gap-3 shadow-2xl">
               <div className={cn(
                 "p-1.5 rounded-full text-primary shrink-0 transition-colors",
                 isEditing ? "bg-primary text-white" : "bg-primary/20"
               )}>
                 {isEditing ? <Pencil size={14} /> : <Navigation size={14} />}
               </div>
               <div className="flex flex-col">
                 <h3 className="font-bold text-xs leading-none">
                   {isEditing ? "Editing Mode" : "Confirm Location"}
                 </h3>
                 <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                   {isEditing 
                     ? "Drag pins to move" 
                     : "Tap lock to edit"
                   }
                 </p>
               </div>
             </div>
          </div>
          )}
        </div>

        {/* Floating Header Elements */}
        <div className={cn(
          "absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 pb-4 pointer-events-none transition-opacity duration-300",
          isEditing && "opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center justify-between gap-4 mb-4 pointer-events-auto">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLocation("/home")}
                disabled={isEditing}
                className={cn(
                  "p-2 rounded-full bg-card/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors",
                  isEditing && "opacity-50 cursor-not-allowed"
                )}
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-lg font-display font-bold tracking-wide drop-shadow-md">DEVICE MAP</h1>
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "p-2 rounded-full transition-all border backdrop-blur",
                isEditing 
                  ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
                  : "bg-card/30 border-white/10 hover:bg-white/10"
              )}
            >
              {isEditing ? <Pencil size={20} /> : <Lock size={20} />}
            </button>
          </div>

          {/* Location Selector - Compact & Floating */}
          <div className="pointer-events-auto">
            <Select value={selectedLocationId} onValueChange={setSelectedLocationId} disabled={isEditing}>
              <SelectTrigger className="w-full bg-card/60 backdrop-blur-md border border-white/10 rounded-xl py-6 pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <MapPin size={16} className="text-muted-foreground shrink-0" />
                <span className="flex-1 text-center truncate">
                  <SelectValue placeholder="Select a location" />
                </span>
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-white/10 text-foreground">
                {locations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id} className="focus:bg-white/10 focus:text-white cursor-pointer py-3 justify-center">
                    <div className="flex flex-col items-center text-center">
                      <span className="font-bold">{loc.name}</span>
                      <span className="text-xs text-muted-foreground">{loc.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Edit Toggle (Visible when editing) */}
        {isEditing && (
          <div className="absolute top-6 right-6 z-30">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "p-2 rounded-full transition-all border backdrop-blur",
                isEditing 
                  ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
                  : "bg-card/30 border-white/10 hover:bg-white/10"
              )}
            >
              {isEditing ? <Pencil size={20} /> : <Lock size={20} />}
            </button>
          </div>
        )}
        
        <div className={cn("z-20 mt-auto pt-10 transition-opacity duration-300", isEditing && "opacity-0 pointer-events-none")}>
          <BottomNav />
        </div>
      </div>
    </MobileLayout>
  );
}
