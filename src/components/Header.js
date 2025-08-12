import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Styles.module.css';

const Header = ({ username, scrollToProduct, scrollToCourse, setShowedModal, handleLogout }) => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // toggle mobile menu

  return (
    <header className={styles.header}>
      <img src="./kediri-technopark-logo.png" className={styles.logo} alt="Logo" />

      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        <a
          className={`${styles.navLink} ${hoveredNav === 2 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(2)}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => navigate('/')}
        >
          HOME
        </a>
        <a
          className={`${styles.navLink} ${hoveredNav === 3 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(3)}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => {
            if (!username) scrollToProduct();
            else navigate('/products');
          }}
        >
          {username ? 'MY PRODUCTS' : 'PRODUCTS'}
        </a>
        <a
          className={`${styles.navLink} ${hoveredNav === 4 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(4)}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => {
            if (!username) scrollToCourse();
            else window.location.href = 'https://academy.kediritechnopark.com'
          }}
        >
          {username ? 'MY ACADEMY' : 'ACADEMY'}
        </a>
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

              <button className={styles.logoutButton} onClick={() => {
                 navigate('/products');
              }}>
                MY PRODUCTS
              </button>

              <button className={styles.logoutButton} onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}>
                Logout
              </button>
            </>
          ) : (
            <button
              className={styles.loginButton}
              onClick={() => {
                setMenuOpen(false);
                setShowedModal('login');
              }}
            >
              LOGIN
            </button>
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
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
