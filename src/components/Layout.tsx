import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

// Shared Assets
import PrimaryLogo from '../assets/images/Primary-Logo.png';
import SecondaryLogo from '../assets/images/Secondary-Logo.png';

const Layout: React.FC = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <div className={styles.container}>
      {/* --- SHARED NAVBAR --- */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link to="/" className={styles.brand}>
            <img src={PrimaryLogo} alt="Girumdom Logo" className={styles.logo} />
            <img src={SecondaryLogo} alt="Girumdom Logo" className={styles.brandNameLogo} />
          </Link>

          <div className={styles.navLinks}>
            {/* Logic: If on /about, show purple text. Else show button. */}
            {isAboutPage ? (
              <span className={`${styles.navLink} ${styles.activeLink}`}>
                How It Works
              </span>
            ) : (
              <Link to="/about" className={styles.aboutBtn}>
                How It Works
              </Link>
            )}

            <Link to="/login" className={styles.loginBtn} aria-label="Login to Portal">
              Login to Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC PAGE CONTENT --- */}
      {/* This <Outlet /> is where LandingPage or HowItWorks will appear */}
      <div className={styles.pageContent}>
        <Outlet />
      </div>

      {/* --- SHARED FOOTER --- */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>© 2025 Girumdom.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;