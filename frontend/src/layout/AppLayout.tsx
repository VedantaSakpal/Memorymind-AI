import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/app/AppSidebar';
import AppTopbar from '@/components/app/AppTopbar';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans antialiased text-slate-900 selection:bg-[#0D5B5A] selection:text-white">
      {/* Dark Navy Sidebar */}
      <AppSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <AppTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
