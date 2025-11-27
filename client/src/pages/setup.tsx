import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore } from "@/lib/store";
import { ArrowLeft, ChevronRight, Check, MapPin, Layers, ScanLine, Wifi, CheckCircle2, Camera, Keyboard, Plus, X, ArrowUpFromLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SetupPage() {
  const [, setLocation] = useLocation();
  const { addDevice, locations, groups, addLocation, addGroup } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    locationId: "",
    groupId: "",
    serialNumber: "",
    name: "",
    network: "",
    height: ""
  });

  // Step 1: Location & Group
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationAddress, setNewLocationAddress] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const [newGroupName, setNewGroupName] = useState("");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  
  // Step 2: Scan
  const [scanning, setScanning] = useState(true);
  const [manualId, setManualId] = useState("");

  // Step 4: Network
  const networks = ["FireDynamics_Mesh_A", "Office_Guest", "Warehouse_IoT"];

  const handleAddLocation = () => {
    if (!newLocationName.trim()) return;
    const id = addLocation(newLocationName, newLocationAddress);
    setFormData({ ...formData, locationId: id });
    setIsAddingLocation(false);
    setNewLocationName("");
    setNewLocationAddress("");
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const id = addGroup(newGroupName, formData.locationId);
    setFormData({ ...formData, groupId: id });
    setIsAddingGroup(false);
    setNewGroupName("");
  };

  const handleNext = () => {
    if (step === 1 && !formData.locationId) return;
    if (step === 2 && !formData.groupId) return;
    if (step === 3 && !formData.serialNumber) return;
    if (step === 4 && !formData.name) return;
    if (step === 5 && !formData.height) return;
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setLocation("/home");
  };

  const handleFinish = () => {
    addDevice({
      name: formData.name,
      serialNumber: formData.serialNumber,
      locationId: formData.locationId,
      groupId: formData.groupId,
      status: 'online',
      height: parseInt(formData.height) || 0
    });
    setLocation("/home");
  };

  const handleScanSimulate = () => {
    setFormData({ ...formData, serialNumber: "DEV-8849-XJ" });
    setTimeout(() => setStep(4), 500);
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col h-full">
        
        {/* Header */}
        <div className="p-6 flex items-center gap-4">
          <button onClick={handleBack} className="p-2 rounded-full bg-white/5 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold tracking-wide">SETUP WIZARD</h1>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-white/10")} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <MapPin size={32} />
                </div>
                <h2 className="text-xl font-bold">Select Location</h2>
                <p className="text-sm text-muted-foreground">Where is this device being installed?</p>
              </div>

              <div className="space-y-2">
                {locations
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(loc => (
                  <button
                    key={loc.id}
                    onClick={() => setFormData({ ...formData, locationId: loc.id })}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                      formData.locationId === loc.id ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                    )}
                  >
                    <span>{loc.name}</span>
                    {formData.locationId === loc.id && <Check size={18} className="text-primary" />}
                  </button>
                ))}
                
                {isAddingLocation ? (
                  <div className="w-full p-4 rounded-xl border border-primary bg-primary/5 space-y-3 animate-in fade-in zoom-in-95">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Location Name"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddLocation();
                        }}
                      />
                      <button 
                        onClick={handleAddLocation}
                        className="p-2 bg-primary rounded-lg text-white hover:bg-primary/90"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => setIsAddingLocation(false)}
                        className="p-2 bg-white/10 rounded-lg text-muted-foreground hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="border-t border-white/10 pt-2">
                      <input
                        type="text"
                        placeholder="Address (Optional)"
                        value={newLocationAddress}
                        onChange={(e) => setNewLocationAddress(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-muted-foreground"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddLocation();
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAddingLocation(true);
                      setNewLocationName("");
                    }}
                    className="w-full p-4 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add New Location
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: GROUP */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Layers size={32} />
                </div>
                <h2 className="text-xl font-bold">Select Device Group</h2>
                <p className="text-sm text-muted-foreground">Group this device for easier management.</p>
              </div>

              <div className="space-y-2">
                {groups
                  .filter(g => g.locationId === formData.locationId)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(grp => (
                  <button
                    key={grp.id}
                    onClick={() => setFormData({ ...formData, groupId: grp.id })}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                      formData.groupId === grp.id ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                    )}
                  >
                    <span>{grp.name}</span>
                    {formData.groupId === grp.id && <Check size={18} className="text-primary" />}
                  </button>
                ))}
                
                {isAddingGroup ? (
                  <div className="w-full p-4 rounded-xl border border-primary bg-primary/5 flex items-center gap-2 animate-in fade-in zoom-in-95">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Group Name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddGroup();
                      }}
                    />
                    <button 
                      onClick={handleAddGroup}
                      className="p-2 bg-primary rounded-lg text-white hover:bg-primary/90"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => setIsAddingGroup(false)}
                      className="p-2 bg-white/10 rounded-lg text-muted-foreground hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsAddingGroup(true);
                      setNewGroupName("");
                    }}
                    className="w-full p-4 rounded-xl border border-dashed border-white/20 text-muted-foreground hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add New Group
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SCAN */}
          {step === 3 && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8">
               <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Register Device</h2>
                <p className="text-sm text-muted-foreground">Scan the QR code on the unit.</p>
              </div>

              <Tabs defaultValue="scan" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md mb-6">
                  <TabsTrigger value="scan"><Camera className="w-4 h-4 mr-2"/> Scan</TabsTrigger>
                  <TabsTrigger value="manual"><Keyboard className="w-4 h-4 mr-2"/> Manual</TabsTrigger>
                </TabsList>

                <TabsContent value="scan" className="flex-1 flex flex-col items-center">
                  <div 
                    onClick={handleScanSimulate}
                    className="relative w-64 h-64 border-2 border-white/30 rounded-3xl flex items-center justify-center overflow-hidden backdrop-blur-sm bg-white/5 mb-8 cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="absolute inset-0 border-[3px] border-primary rounded-3xl opacity-50"></div>
                    <motion.div 
                      className="absolute w-full h-1 bg-primary shadow-[0_0_15px_rgba(255,50,50,0.8)]"
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <ScanLine className="text-white/50 w-12 h-12" />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Tap frame to simulate scan</p>
                </TabsContent>

                <TabsContent value="manual">
                  <div className="space-y-4">
                    <label className="text-xs font-mono uppercase text-primary">Serial Number</label>
                    <input 
                      type="text" 
                      placeholder="DEV-XXXX-XX"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      className="w-full bg-card border border-white/20 rounded-xl p-4 font-mono uppercase"
                    />
                     <button 
                      onClick={() => {
                        setFormData({ ...formData, serialNumber: manualId });
                        handleNext();
                      }}
                      disabled={!manualId}
                      className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      Continue
                    </button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* STEP 4: NAME */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">Name Your Device</h2>
                <p className="text-sm text-muted-foreground">Give it a unique identifier.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-primary">Device Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. North Corner Turret"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-card border border-white/20 rounded-xl p-4"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-muted-foreground">Serial Number:</p>
                <p className="font-mono text-primary">{formData.serialNumber}</p>
              </div>
            </div>
          )}

          {/* STEP 5: HEIGHT */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <ArrowUpFromLine size={32} />
                </div>
                <h2 className="text-xl font-bold">Installation Height</h2>
                <p className="text-sm text-muted-foreground">How high off the ground is this device mounted?</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-primary">Height (Feet)</label>
                <div className="relative">
                    <input 
                    type="number" 
                    placeholder="e.g. 12"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full bg-card border border-white/20 rounded-xl p-4 pr-12 text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">FT</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                  {[8, 10, 12, 15, 20, 25].map(h => (
                      <button
                        key={h}
                        onClick={() => setFormData({ ...formData, height: h.toString() })}
                        className={cn(
                            "p-3 rounded-xl border transition-all font-mono font-bold",
                            formData.height === h.toString() 
                                ? "bg-primary text-white border-primary" 
                                : "bg-card border-white/10 hover:bg-white/5"
                        )}
                      >
                          {h} FT
                      </button>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 6: NETWORK */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Wifi size={32} />
                </div>
                <h2 className="text-xl font-bold">Connect to Network</h2>
                <p className="text-sm text-muted-foreground">Select a Wi-Fi network for the device.</p>
              </div>
              
              <div className="space-y-2">
                {networks.map(net => (
                   <button
                    key={net}
                    onClick={() => setFormData({ ...formData, network: net })}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all",
                      formData.network === net ? "border-primary bg-primary/10" : "border-white/10 bg-card"
                    )}
                  >
                    <span>{net}</span>
                    {formData.network === net && <Check size={18} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0">
          {step < 6 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.locationId) ||
                (step === 2 && !formData.groupId) ||
                (step === 3) || // Step 3 handles its own next via scan/input
                (step === 4 && !formData.name) ||
                (step === 5 && !formData.height)
              }
              className="w-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
             <button
              onClick={handleFinish}
              disabled={!formData.network}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <CheckCircle2 size={20} /> Complete Setup
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
