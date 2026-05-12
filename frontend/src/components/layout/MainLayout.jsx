import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';
import './MainLayout.css';

// Main app layout with navbar and sidebar
export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="main-layout">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPath={pathname} />
        <main className="main-content" id="main-content" tabIndex="-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
