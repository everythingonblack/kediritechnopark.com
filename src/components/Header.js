import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles.module.css';

const Header = ({ username, scrollToProduct, scrollToCourse, setShowedModal, handleLogout }) => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // toggle mobile menu
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToId = (id) => {
    // Ensure we are on home, then scroll to target id smoothly
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      // Backward compatibility with refs passed from App for products/academy
      if (id === 'products' && typeof scrollToProduct === 'function') scrollToProduct();
      if (id === 'academy' && typeof scrollToCourse === 'function') scrollToCourse();
    }, 0);
  };

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <img src="./kediri-technopark-logo.png" className={styles.logo} alt="Logo" />

      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        {username &&
          <>
            <a
              className={`${styles.navLink} ${hoveredNav === 2 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(2)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { navigate('/'); setMenuOpen(false); }}
            >
              Home
            </a>
            <a
              className={`${styles.navLink} ${hoveredNav === 3 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(3)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => {
                navigate('/dashboard');
                setMenuOpen(false);
              }}>
              Dashboard
            </a>
          </>
        }
        {!username &&
          <>
            <a
              className={`${styles.navLink} ${hoveredNav === 21 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(21)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { scrollToId('about'); setMenuOpen(false); }}
            >
              About
            </a>
            <a
              className={`${styles.navLink} ${hoveredNav === 22 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(22)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { scrollToId('services'); setMenuOpen(false); }}
            >
              Services
            </a>
            <a
              className={`${styles.navLink} ${hoveredNav === 3 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(3)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { scrollToId('products'); setMenuOpen(false); }}
            >
              Products
            </a>
            <a
              className={`${styles.navLink} ${hoveredNav === 4 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(4)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { scrollToId('academy'); setMenuOpen(false); }}
            >
              Academy
            </a>
            <a
              className={`${styles.navLink} ${hoveredNav === 5 ? styles.navLinkHover : ''}`}
              onMouseEnter={() => setHoveredNav(5)}
              onMouseLeave={() => setHoveredNav(null)}
              onClick={() => { scrollToId('faq'); setMenuOpen(false); }}
            >
              FAQ
            </a>
          </>
        }
      </nav>

      {/* Burger Menu Button */}
      <div className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {username ? (
            <>
              <div className={styles.username}>{username}</div>
              <button onClick={() => { setMenuOpen(false); navigate('/'); }}>Home</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('about'); }}>About</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('services'); }}>Services</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('products'); }}>Products</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('academy'); }}>Academy</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('faq'); }}>FAQ</button>
              <button className={styles.logoutButton} onClick={() => {
                navigate('/dashboard');
                setMenuOpen(false);
              }}>
                Dashboard
              </button>

              <button className={styles.logoutButton} onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setMenuOpen(false); navigate('/'); }}>Home</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('about'); }}>About</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('services'); }}>Services</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('products'); }}>Products</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('academy'); }}>Academy</button>
              <button onClick={() => { setMenuOpen(false); scrollToId('faq'); }}>FAQ</button>
              <button
                className={styles.loginButton}
                onClick={() => {
                  setMenuOpen(false);
                  setShowedModal('login');
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      )}

      {/* Desktop Auth Buttons */}
      <div className={styles.authButtons}>
        {username && (
          <div className={styles.loggedInContainer}>
            <span className={styles.username}>{username}</span>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        )}
        {!username && (
          <button className={styles.loginButton} onClick={() => setShowedModal('login')}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
