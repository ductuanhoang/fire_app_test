import { useLocation } from "wouter";
import { MobileLayout } from "@/components/mobile-layout";
import { useAppStore, Notification } from "@/lib/store";
import { BottomNav } from "@/components/bottom-nav";
import { Bell, Trash2, AlertTriangle, Info, AlertOctagon, X, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { notifications, markNotificationRead, deleteNotification } = useAppStore();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort: Emergency > Warning > Info, then by time
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priority = { emergency: 3, warning: 2, info: 1 };
    return priority[b.type] - priority[a.type];
  });

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'emergency': return <AlertOctagon className="text-red-500" />;
      case 'warning': return <AlertTriangle className="text-yellow-500" />;
      case 'info': return <Info className="text-blue-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationRead(notification.id);
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  return (
    <MobileLayout className="bg-background text-foreground">
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-md border-b border-white/5">
          <h1 className="text-xl font-display font-bold">NOTIFICATIONS</h1>
          <div className="relative">
             <Bell size={20} />
             {notifications.some(n => !n.read) && (
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>No new notifications</p>
            </div>
          ) : (
            sortedNotifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "bg-card border rounded-xl p-4 flex gap-4 relative overflow-hidden group transition-all cursor-pointer hover:bg-white/5",
                  notification.read ? "border-white/5 opacity-70" : "border-white/20 bg-white/5",
                  notification.type === 'emergency' && "border-red-500/50 bg-red-500/10"
                )}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("font-bold text-sm truncate", notification.type === 'emergency' && "text-red-400")}>
                      {notification.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{notification.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.deviceId && (
                    <div className="mt-2 text-[10px] font-mono bg-black/20 inline-block px-2 py-1 rounded text-white/50">
                      ID: {notification.deviceId}
                    </div>
                  )}
                </div>

                {/* Swipe Actions Mock (using a delete button for simplicity) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="absolute right-0 top-0 bottom-0 w-12 bg-red-500/20 flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>

        <BottomNav />
      </div>

      {/* Notification Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-white/10 text-foreground sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedNotification && (
                <div className={cn("p-2 rounded-full bg-white/5", 
                  selectedNotification.type === 'emergency' && "bg-red-500/20",
                  selectedNotification.type === 'warning' && "bg-yellow-500/20",
                  selectedNotification.type === 'info' && "bg-blue-500/20"
                )}>
                  {getIcon(selectedNotification.type)}
                </div>
              )}
              <DialogTitle className={cn("text-xl", 
                selectedNotification?.type === 'emergency' && "text-red-400"
              )}>
                {selectedNotification?.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-base text-foreground/90 mt-4 leading-relaxed">
              {selectedNotification?.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>{selectedNotification?.timestamp}</span>
            </div>
            
            {selectedNotification?.deviceId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag size={16} />
                <span className="font-mono bg-white/5 px-2 py-0.5 rounded text-xs">
                  Device ID: {selectedNotification.deviceId}
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              className="border-white/10 hover:bg-white/5 hover:text-white"
            >
              Close
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedNotification) {
                  deleteNotification(selectedNotification.id);
                  setIsDialogOpen(false);
                }
              }} 
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
