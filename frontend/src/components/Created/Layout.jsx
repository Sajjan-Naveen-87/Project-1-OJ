import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SplashCursor from '../SplashCursor/SplashCursor';

const Layout = () => {
  return (
    <>
      <SplashCursor />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 bg-gray-950 text-white">
          <Outlet /> {/* Renders the matched child route component */}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;