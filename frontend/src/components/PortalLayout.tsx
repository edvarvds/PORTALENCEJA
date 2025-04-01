import React from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortalLayout; 