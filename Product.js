import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Zap, Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Store' },
    { to: '/services', label: 'Services' },
    { to: '/builder', label: 'PC Builder' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: '0 24px',
          background: scrolled ? 'rgba(3, 7, 18, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 212, 255, 0.15)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
              <Zap size={28} color="#00d4ff" fill="#00d4ff" />
            </motion.div>
            <span style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.4rem', background: 'linear-gradient(135deg, #00d4ff, #b026ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS<span style={{ color: '#00d4ff' }}>TECH</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                fontFamily: 'Orbitron', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '2px',
                textDecoration: 'none', textTransform: 'uppercase',
                color: location.pathname === link.to ? '#00d4ff' : '#94a3b8',
                transition: 'color 0.3s ease', position: 'relative',
              }}>
                {link.label}
                {location.pathname === link.to && (
                  <motion.div layoutId="nav-underline" style={{
                    position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, #00d4ff, #b026ff)',
                    boxShadow: '0 0 8px #00d4ff',
                  }} />
                )}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
              <Search size={20} />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative', color: '#94a3b8', display: 'flex' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingCart size={20} />
              </motion.div>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: 'linear-gradient(135deg, #00d4ff, #b026ff)',
                    color: 'white', borderRadius: '50%', width: '18px', height: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontFamily: 'Orbitron', fontWeight: 700,
                  }}>
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                    color: '#00d4ff', padding: '6px 14px', cursor: 'pointer', borderRadius: '4px',
                    fontFamily: 'Orbitron', fontSize: '0.7rem',
                  }}>
                  <User size={16} />
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} />
                </motion.button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                        background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(0,212,255,0.2)',
                        borderRadius: '8px', padding: '8px 0', minWidth: '180px', zIndex: 100,
                        backdropFilter: 'blur(20px)',
                      }}>
                      {[
                        { to: '/dashboard', label: 'Dashboard' },
                        { to: '/dashboard/orders', label: 'My Orders' },
                        { to: '/dashboard/builds', label: 'My Builds' },
                        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)}
                          style={{
                            display: 'block', padding: '10px 16px', color: '#94a3b8',
                            textDecoration: 'none', fontFamily: 'Rajdhani', fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => e.target.style.color = '#00d4ff'}
                          onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid rgba(0,212,255,0.1)', marginTop: '8px', paddingTop: '8px' }}>
                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          style={{
                            width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                            color: '#ff2d7d', cursor: 'pointer', fontFamily: 'Rajdhani', fontSize: '0.95rem',
                            textAlign: 'left',
                          }}>
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn-neon" style={{ padding: '8px 20px', fontSize: '0.7rem' }}>
                  LOGIN
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              className="mobile-menu-btn">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(0,212,255,0.1)', padding: '12px 0' }}>
              <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '12px' }}>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="input-cyber" style={{ flex: 1 }} autoFocus />
                <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px',
              background: 'rgba(3,7,18,0.98)', backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(0,212,255,0.2)', zIndex: 999,
              padding: '80px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
            {navLinks.map((link, i) => (
              <motion.div key={link.to} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <Link to={link.to} onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'block', padding: '14px 0', fontFamily: 'Orbitron', fontSize: '0.85rem',
                    letterSpacing: '2px', textDecoration: 'none', textTransform: 'uppercase',
                    color: location.pathname === link.to ? '#00d4ff' : '#94a3b8',
                    borderBottom: '1px solid rgba(0,212,255,0.1)',
                  }}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
