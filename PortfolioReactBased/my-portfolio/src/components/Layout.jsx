import { Outlet } from 'react-router-dom';
import SkipLink from './SkipLink';
import { useScrollProgress } from '../hooks/useScrollProgress';

const Layout = ({ Header, Footer }) => {
  const scrollProgress = useScrollProgress();

  return (
    <div className="bg-gradient-to-br from-[#181c24] via-[#232946] to-[#181c24] text-[#e9e9f0] min-h-screen overflow-x-hidden flex flex-col">
      <SkipLink />
      <div className="fixed top-0 left-0 w-full h-1 bg-[#232946]/60 backdrop-blur-sm z-50" role="progressbar" aria-valuenow={Math.round(scrollProgress)} aria-valuemin="0" aria-valuemax="100" aria-label="Scroll progress">
        <div 
          className="h-full bg-gradient-to-r from-[#3be8b0]/90 via-[#a5a6f6]/90 to-[#232946]/90 transition-all duration-300 shadow-lg shadow-[#3be8b0]/20"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {Header && <Header />}
      <main id="main-content" className="flex-1 max-w-5xl mx-auto w-full px-4" tabIndex={-1}>
        <Outlet />
      </main>
      {Footer && <Footer />}
    </div>
  );
};

export default Layout;
