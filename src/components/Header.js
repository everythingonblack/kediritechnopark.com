import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navbar, Nav, Container } from 'react-bootstrap';
import styles from './Styles.module.css';

const Header = ({ username, scrollToProduct, scrollToCourse, setShowedModal }) => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState(null);


  return (

    <header className={styles.header}>
      <img src="./kediri-technopark-logo.png" className={styles.logo} alt="Logo" />

      <nav className={styles.nav}>
       
        <a
          className={`${styles.navLink} ${hoveredNav === 2 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(2)}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => {
            if (username == null) {
              scrollToProduct();
            }
            else {
              navigate('/products');
            }
          }}
        >
          PRODUCTS
        </a>
        <a
          className={`${styles.navLink} ${hoveredNav === 3 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(3)}
          onMouseLeave={() => setHoveredNav(null)}
          onClick={() => {
            if (username == null) {
              scrollToCourse();
            }
            else {
              navigate('/products');
            }
          }}
        >
                      {username == null ? "PRODUCTS" : "MY PRODUCTS"}

        </a>
        <a
          className={`${styles.navLink} ${hoveredNav === 4 ? styles.navLinkHover : ''}`}
          onMouseEnter={() => setHoveredNav(4)}
          onMouseLeave={() => setHoveredNav(null)}
        >
          USER
        </a>
      </nav>

      <div className={styles.authButtons}>
        {username ? (
          <span style={{ color: '#2563eb', fontWeight: '600' }}>
            Halo, {username}
          </span>
        ) : (
          <button className={styles.loginButton} onClick={() => setShowedModal('login')}>
            LOGIN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;