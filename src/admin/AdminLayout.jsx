import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#090b0e] text-neutral-900 dark:text-neutral-100 flex transition-colors duration-200">
      {/* Collapsible / Fixed Admin Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Admin Header */}
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Nested Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
