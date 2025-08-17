import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.footerContent}>
          <Col lg={3} md={6} className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <img 
                src="https://kediritechnopark.com/kediri-technopark-logo-white.png" 
                alt="Kediri Technopark Logo" 
                className={styles.logoImage}
              />
            </div>
            <p className={styles.companyDescription}>
              Kediri Technopark adalah pusat pengembangan inovasi digital dan aplikasi untuk masyarakat dan pelaku usaha.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://instagram.com/kediri.technopark" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/kediri-technopark" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://facebook.com/kediritechnopark" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </Col>
          
          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="fas fa-map-marker-alt"></i>
                <span>Sunan Giri GG. I No. 11, Rejomulyo, Kediri, Jawa Timur 64129</span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <span><a href="tel:+6281318894994">0813 1889 4994</a></span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <span><a href="mailto:marketing@kediritechnopark.com">marketing@kediritechnopark.com</a></span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-globe"></i>
                <span><a href="https://kediritechnopark.com" target="_blank" rel="noopener noreferrer">www.KEDIRITECHNOPARK.com</a></span>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>Newsletter</h3>
            <div className={styles.newsletter}>
              <p>Subscribe to our newsletter for the latest updates</p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="Your email address" className={styles.newsletterInput} />
                <button className={styles.newsletterButton}>Subscribe</button>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className={styles.footerBottom}>
          <Col lg={12}>
            <div className={styles.copyright}>
              <p>&copy; 2025 Kediri Technopark. All Rights Reserved.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
