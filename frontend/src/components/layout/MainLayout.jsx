import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import './MainLayout.css';

// Main app layout with navbar and sidebar
export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebarOpen);

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  return (
    <div className="main-layout">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-layout-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content" id="main-content" tabIndex="-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
