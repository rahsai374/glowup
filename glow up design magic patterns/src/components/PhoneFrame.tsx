import React from 'react';
export function PhoneFrame({ children }: {children: React.ReactNode;}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-[390px] h-[844px] max-h-[100dvh] bg-brand-bg rounded-[40px] shadow-2xl overflow-hidden border-[8px] border-white/20 ring-1 ring-black/5 flex flex-col">
        {/* Notch simulation */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
          <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
        </div>

        {/* App Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar relative flex flex-col bg-brand-bg">
          {children}
        </div>
      </div>
    </div>);

}