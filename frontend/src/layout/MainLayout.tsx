import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const MainLayout = () => (
  <div className="min-h-screen bg-[#F8FAFB] text-[#111111] selection:bg-[#000000] selection:text-white flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
