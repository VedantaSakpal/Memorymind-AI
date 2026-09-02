import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const MainLayout = () => (
  <div className="min-h-screen bg-[#F8FAFB] text-[#0C162C] selection:bg-[#0D5B5A] selection:text-white flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
