import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore, Device } from "@/lib/store";
import { BottomNav } from "@/components/bottom-nav";
import { Plus, Search, MoreVertical, Circle, AlertTriangle, Shield, Battery, Signal, ChevronRight, Pencil, Flame, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Device List Item Component for Long Press Handling
const DeviceListItem = ({ 
  device, 
  onMove, 
  onNavigate, 
  onUpdate, 
  getStatusColor 
}: { 
  device: Device; 
  onMove: (device: Device) => void; 
  onNavigate: (id: string) => void; 
  onUpdate: (id: string, data: Partial<Device>) => void; 
  getStatusColor: (status: Device['status']) => string; 
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleTapStart = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      onMove(device);
    }, 600);
  };

  const handleTap = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isLongPress.current) {
      onNavigate(device.id);
    }
  };

  const handleTapCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isLongPress.current = false;
  };

  return (
    <motion.div 
      onTapStart={handleTapStart}
      onTap={handleTap}
      onTapCancel={handleTapCancel}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-white/20 group relative select-none"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-white/5", 
          device.status === 'emergency' && "animate-pulse bg-red-500/20",
          device.status === 'pre-soaking' && (device.mode === 'manual' && device.fireStatus !== 'active' ? "bg-yellow-500/20" : "animate-pulse bg-blue-500/20")
        )}>
           {device.status === 'emergency' ? (
             <Flame size={20} className="text-red-500" />
           ) : device.status === 'warning' ? (
             <AlertTriangle size={20} className="text-yellow-400" />
           ) : device.status === 'pre-soaking' ? (
             device.mode === 'manual' && device.fireStatus !== 'active' ? (
               <AlertTriangle size={20} className="text-yellow-400" />
             ) : (
               <Droplet size={20} className="text-blue-500 fill-blue-500" />
             )
           ) : (
             <Shield size={20} className={cn(
               device.status === 'online' ? "text-green-400" : "text-gray-500"
             )} />
           )}
        </div>
        <div>
          <h3 className="font-bold text-sm">{device.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn("w-2 h-2 rounded-full", getStatusColor(device.status))}></div>
            <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
            {device.status === 'warning' && (
              <span className="text-xs text-yellow-500 flex items-center gap-1">
                <AlertTriangle size={10} /> Check
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
         {device.mode === 'automatic' && (device.status === 'emergency' || device.status === 'pre-soaking') && (
           <div 
             className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-green-900/20 animate-pulse"
           >
             ACTIVE
           </div>
         )}
         {device.mode === 'manual' && (device.status === 'emergency' || device.status === 'pre-soaking') && (
           <motion.button 
             whileTap={{ scale: 0.95 }}
             onTap={(e) => {
                e.stopPropagation();
                // Also stop immediate propagation if possible
                // Check if nativeEvent exists (it might not on Framer Motion events)
                // Cast to any if needed to avoid TS errors for now or just skip nativeEvent check
             }}
             onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
             }}
             onClick={(e) => {
               e.stopPropagation();
               e.preventDefault();
               onUpdate(device.id, {
                 fireStatus: device.fireStatus === 'active' ? 'warning' : 'active'
               });
             }}
             className={cn(
               "px-3 py-1 text-white text-xs font-bold rounded-lg transition-all animate-pulse shadow-lg cursor-pointer z-50 relative",
               device.fireStatus === 'active' 
                 ? "bg-green-500 hover:bg-green-600 shadow-green-900/20" 
                 : "bg-destructive hover:bg-destructive/90 shadow-red-900/20"
             )}
           >
             {device.fireStatus === 'active' ? "ACTIVE" : "ACTIVATE"}
           </motion.button>
         )}
         {device.batteryLevel < 20 && (
           <Battery size={16} className="text-red-500" />
         )}
         <ChevronRight size={16} className="text-muted-foreground group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { locations, groups, devices, removeDevice, updateLocation, updateGroup, updateDevice, addLocation, addGroup } = useAppStore();

  const [editLocationId, setEditLocationId] = useState<string | null>(null);
  const [editLocationName, setEditLocationName] = useState("");
  const [editLocationAddress, setEditLocationAddress] = useState("");
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);

  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);

  // Add Location State
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");

  // Add Group State
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [targetLocationForGroup, setTargetLocationForGroup] = useState<string>("");

  const [activeTab, setActiveTab] = useState("all");

  // Move Device State
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [deviceToMove, setDeviceToMove] = useState<Device | null>(null);
  const [targetLocationId, setTargetLocationId] = useState<string>("");
  const [targetGroupId, setTargetGroupId] = useState<string>("");

  // Helper to get status color
  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'emergency': return 'bg-red-500';
      case 'pre-soaking': return 'bg-blue-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Group devices by Location -> Group
  const groupedData = locations
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(loc => {
    const locGroups = groups
      .filter(g => g.locationId === loc.id)
      .sort((a, b) => a.name.localeCompare(b.name));
      
    return {
      ...loc,
      groups: locGroups.map(grp => ({
        ...grp,
        devices: devices.filter(d => d.groupId === grp.id)
      }))
    };
  });

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-md border-b border-white/5">
          <h1 className="text-xl font-display font-bold">MY DEVICES</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-white/10">
              <Search size={20} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <button className="p-2 rounded-full hover:bg-white/10">
                  <Plus size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-white/10 text-foreground">
                <DropdownMenuItem onClick={() => setLocation('/setup')}>
                  Add New Device
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddLocationOpen(true)}>
                  Add New Location
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAddGroupOpen(true)}>
                  Add New Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-2">
            <TabsList className="w-full bg-white/5 flex justify-start overflow-x-auto custom-scrollbar h-auto p-1 gap-1">
              <TabsTrigger value="all" className="flex-shrink-0 px-4 min-w-[60px]">All</TabsTrigger>
              {locations.map(loc => (
                <TabsTrigger key={loc.id} value={loc.id} className="flex-shrink-0 px-4 min-w-fit truncate max-w-[150px]">
                  {loc.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {groupedData
              .filter(location => activeTab === "all" || location.id === activeTab)
              .map(location => (
              <div key={location.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between px-2 group/header">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    setEditLocationId(location.id);
                    setEditLocationName(location.name);
                    setEditLocationAddress(location.address || "");
                    setIsEditLocationOpen(true);
                  }}
                >
                  <h2 className="text-sm font-mono uppercase text-muted-foreground tracking-wider group-hover/header:text-white transition-colors">{location.name}</h2>
                  <Pencil size={14} className="text-muted-foreground opacity-0 group-hover/header:opacity-100 transition-opacity" />
                </div>
              </div>

              {location.groups.map(group => (
                <div key={group.id} className="space-y-2">
                  {group.devices.length > 0 && (
                    <div className="flex items-center justify-between px-2 group/subheader">
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setEditGroupId(group.id);
                          setEditGroupName(group.name);
                          setIsEditGroupOpen(true);
                        }}
                      >
                        <div className="text-xs font-bold text-primary group-hover/subheader:text-primary/80 transition-colors">{group.name}</div>
                        <Pencil size={12} className="text-muted-foreground opacity-0 group-hover/subheader:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {group.devices.map(device => (
                      <DeviceListItem
                        key={device.id}
                        device={device}
                        onMove={(d) => {
                          setDeviceToMove(d);
                          setTargetLocationId(d.locationId);
                          setTargetGroupId(d.groupId);
                          setIsMoveDialogOpen(true);
                        }}
                        onNavigate={(id) => setLocation(`/device/${id}`)}
                        onUpdate={updateDevice}
                        getStatusColor={getStatusColor}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            ))}
          </div>
        </Tabs>

        <BottomNav />
      </div>

      {/* Edit Location Dialog */}
      <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter a new name for this location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
              <Input 
                value={editLocationName} 
                onChange={(e) => setEditLocationName(e.target.value)} 
                className="bg-white/5 border-white/10 text-white"
                placeholder="Location Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Address</label>
              <Input 
                value={editLocationAddress} 
                onChange={(e) => setEditLocationAddress(e.target.value)} 
                className="bg-white/5 border-white/10 text-white"
                placeholder="Address (Optional)"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditLocationOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button onClick={() => {
              if (editLocationId) {
                updateLocation(editLocationId, editLocationName, editLocationAddress);
              }
              setIsEditLocationOpen(false);
            }} className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group Name</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter a new name for this group.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={editGroupName} 
              onChange={(e) => setEditGroupName(e.target.value)} 
              className="bg-white/5 border-white/10 text-white"
              placeholder="Group Name"
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditGroupOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button onClick={() => {
              if (editGroupId) {
                updateGroup(editGroupId, editGroupName);
              }
              setIsEditGroupOpen(false);
            }} className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Move Device Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move Device</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a new location and group for <span className="text-white font-bold">{deviceToMove?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
              <Select value={targetLocationId} onValueChange={(val) => {
                setTargetLocationId(val);
                setTargetGroupId(""); // Reset group when location changes
              }}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 text-foreground">
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Group</label>
              <Select 
                value={targetGroupId} 
                onValueChange={setTargetGroupId}
                disabled={!targetLocationId}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white disabled:opacity-50">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 text-foreground">
                  {groups
                    .filter(g => g.locationId === targetLocationId)
                    .map(grp => (
                      <SelectItem key={grp.id} value={grp.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                        {grp.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button 
              disabled={!targetLocationId || !targetGroupId}
              onClick={() => {
                if (deviceToMove && targetLocationId && targetGroupId) {
                  updateDevice(deviceToMove.id, { 
                    locationId: targetLocationId, 
                    groupId: targetGroupId 
                  });
                  setIsMoveDialogOpen(false);
                }
              }} 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Move Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Location Dialog */}
      <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new location for your devices.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
              <Input 
                value={newLocationName} 
                onChange={(e) => setNewLocationName(e.target.value)} 
                className="bg-white/5 border-white/10 text-white"
                placeholder="Location Name (e.g. Headquarters)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Address</label>
              <Input 
                value={newLocationAddress} 
                onChange={(e) => setNewLocationAddress(e.target.value)} 
                className="bg-white/5 border-white/10 text-white"
                placeholder="Address (Optional)"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsAddLocationOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button 
              disabled={!newLocationName}
              onClick={() => {
                addLocation(newLocationName, newLocationAddress);
                setNewLocationName("");
                setNewLocationAddress("");
                setIsAddLocationOpen(false);
              }} 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Create Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Group Dialog */}
      <Dialog open={isAddGroupOpen} onOpenChange={setIsAddGroupOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new group within a location.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Location</label>
              <Select value={targetLocationForGroup} onValueChange={setTargetLocationForGroup}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 text-foreground">
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id} className="focus:bg-white/10 focus:text-white cursor-pointer">
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Group Name</label>
              <Input 
                value={newGroupName} 
                onChange={(e) => setNewGroupName(e.target.value)} 
                className="bg-white/5 border-white/10 text-white"
                placeholder="Group Name (e.g. Server Room)"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsAddGroupOpen(false)} className="border-white/10 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button 
              disabled={!newGroupName || !targetLocationForGroup}
              onClick={() => {
                addGroup(newGroupName, targetLocationForGroup);
                setNewGroupName("");
                setTargetLocationForGroup("");
                setIsAddGroupOpen(false);
              }} 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
