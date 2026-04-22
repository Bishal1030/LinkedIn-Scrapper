import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center">
      <main className="w-full max-w-4xl px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
