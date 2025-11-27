import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-background md:bg-black">
      <div className={cn(
        "w-full md:max-w-[430px] min-h-screen bg-background relative flex flex-col overflow-hidden",
        "md:shadow-2xl",
        className
      )}>
        {/* iOS Status Bar Placeholder - Only visible on desktop */}
        <div className="hidden md:flex h-12 w-full bg-transparent justify-between items-center px-6 absolute top-0 z-50 text-white font-medium text-sm">
          <span>9:41</span>
          <div className="flex gap-2 items-center">
            <div className="h-3 w-3 rounded-full bg-white/20"></div>
            <div className="h-3 w-3 rounded-full bg-white/20"></div>
            <div className="h-3 w-6 rounded-full border border-white/30 relative">
              <div className="absolute inset-0.5 bg-white rounded-full w-4"></div>
            </div>
          </div>
        </div>
        
        {/* Safe Area Content */}
        <main className="flex-1 flex flex-col md:pt-12 md:pb-8 pb-0">
          {children}
        </main>

        {/* iOS Home Indicator - Only visible on desktop */}
        <div className="hidden md:block absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
      </div>
    </div>
  );
}
