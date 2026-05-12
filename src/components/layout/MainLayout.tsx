import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernSidebar from './ModernSidebar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <ModernSidebar>
      <div className="flex flex-col min-h-screen">
        <div className="p-6 flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ModernSidebar>
  );
};

export default MainLayout;
