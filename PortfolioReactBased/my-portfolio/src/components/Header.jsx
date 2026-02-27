import { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'skills', path: '/skills' },
  { name: 'projects', path: '/projects' },
  { name: 'certificates', path: '/certificates' },
  { name: 'contact', path: '/contact' }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navWidth, setNavWidth] = useState(520);
  const navContainerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const resizeObserverRef = useRef(null);

  const updateNavDimensions = useCallback(() => {
    const container = navContainerRef.current;
    if (!container) return;
    
    const width = container.offsetWidth;
    setNavWidth(width);
    
    const buttons = container.querySelectorAll('.nav-btn');
    const DASH_LENGTH = 4;
    const PERIMETER = 100; 
    const QUARTER = PERIMETER / 4;
    
    buttons.forEach((btn, index) => {
      const rect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const left = rect.left - containerRect.left;
      const btnWidth = rect.width;
      
      
      const startPercent = (left / width) * 100;
      const widthPercent = (btnWidth / width) * 100;
      
      
      const topStart = (startPercent / 100) * QUARTER;
      const topWidth = (widthPercent / 100) * QUARTER;
      const topEnd = topStart + topWidth;
      const bottomStart = QUARTER * 2 + topStart;
      const bottomWidth = topWidth;
      const bottomEnd = bottomStart + bottomWidth;
      
      
      const gapBeforeTop = Math.max(0, topStart - DASH_LENGTH);
      const gapAfterTop = Math.max(0, QUARTER - topEnd);
      const gapBeforeBottom = Math.max(0, QUARTER * 2 - bottomStart);
      const gapAfterBottom = Math.max(0, QUARTER * 3 - bottomEnd);
      
      const dashArray = `${gapBeforeTop} ${DASH_LENGTH} ${topWidth} ${gapAfterTop} ${QUARTER} ${gapBeforeBottom} ${DASH_LENGTH} ${bottomWidth} ${gapAfterBottom} ${QUARTER}`;
      
      container.style.setProperty(`--btn-${index}-dash`, dashArray);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateNavDimensions, 100);
    updateNavDimensions();
    
    const handleResize = () => {
      updateNavDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    
    
    if (navContainerRef.current && window.ResizeObserver) {
      resizeObserverRef.current = new ResizeObserver(() => {
        updateNavDimensions();
      });
      resizeObserverRef.current.observe(navContainerRef.current);
    }
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [location.pathname, updateNavDimensions]);

  return (
    <nav className="fixed top-0 w-full bg-[#232946]/65 backdrop-blur-xl z-40 border-b border-[#3be8b0]/20 shadow-lg shadow-[#232946]/20 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center relative z-10 gap-4">
        <Link 
          to="/"
          className="text-3xl font-bold animate-header-fade-in group relative cursor-pointer transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-offset-2 focus:ring-offset-[#232946] rounded px-2 -ml-2 py-1"
          aria-label="Go to homepage"
        >
          <span 
            className="relative z-10 inline-block transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(59,232,176,0.8)] group-hover:brightness-125"
            style={{
              background: 'linear-gradient(to right, #3be8b0, #a5a6f6, #eebbc3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: '#3be8b0'
            }}
          >
            Vaibhav Sharma
          </span>
          <span className="relative z-10 inline-block ml-1.5">
            <span className="inline-block w-4 text-[#3be8b0] animate-dot-1 text-center font-bold text-xl leading-none">.</span>
            <span className="inline-block w-4 text-[#a5a6f6] animate-dot-2 text-center font-bold text-xl leading-none">.</span>
            <span className="inline-block w-4 text-[#eebbc3] animate-dot-3 text-center font-bold text-xl leading-none">.</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#3be8b0] via-[#a5a6f6] to-[#eebbc3] opacity-0 group-hover:opacity-40 group-hover:animate-gradient-shift blur-lg -z-10 transition-opacity duration-500 rounded px-2"></span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#3be8b0]/30 via-[#a5a6f6]/30 to-[#eebbc3]/30 opacity-0 group-hover:opacity-100 blur-2xl -z-20 transition-opacity duration-500 rounded px-2"></span>
        </Link>
        <div className="hidden md:flex items-center">
          <div className="nav-animated" style={{ width: 'fit-content', minWidth: '480px' }}>
            <div className="nav-container" ref={navContainerRef}>
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-btn ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  data-index={index}
                >
                  {item.name}
                </Link>
              ))}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${navWidth} 42`}
                height="42"
                width={navWidth}
                className="nav-outline"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <rect
                  strokeWidth="2.5"
                  fill="transparent"
                  height="42"
                  width={navWidth}
                  y="0"
                  x="0"
                  pathLength="100"
                  className="nav-rect"
                  rx="21"
                  ry="21"
                />
              </svg>
            </div>
          </div>
        </div>
        <button 
          ref={menuButtonRef}
          className="md:hidden text-[#3be8b0] relative p-2 rounded-lg transition-all duration-300 hover:bg-[#3be8b0]/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-offset-2 focus:ring-offset-[#232946] group" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(59,232,176,0.8)]">
            {isMenuOpen ? <X size={28} className="animate-rotate-in" /> : <Menu size={28} className="animate-rotate-in" />}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#3be8b0]/20 via-[#a5a6f6]/20 to-[#3be8b0]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
        </button>
      </div>
      {isMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn" 
          role="menu" 
          aria-label="Mobile navigation menu"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsMenuOpen(false);
              menuButtonRef.current?.focus();
            }
          }}
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              className="block w-full text-left capitalize py-2 px-4 rounded-lg bg-white/5 hover:bg-gradient-to-r hover:from-[#3be8b0]/20 hover:via-[#a5a6f6]/15 hover:to-[#3be8b0]/20 backdrop-blur-md border border-white/10 hover:border-[#3be8b0]/40 transition-all duration-300 transform hover:translateX(4px) hover:scale-[1.02] hover:shadow-lg hover:shadow-[#3be8b0]/20 focus:outline-none focus:ring-2 focus:ring-[#3be8b0] focus:ring-inset relative overflow-hidden group animate-fadeIn"
              onClick={() => setIsMenuOpen(false)}
              role="menuitem"
              tabIndex={0}
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#3be8b0]/10 via-[#a5a6f6]/10 to-[#3be8b0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Header;
