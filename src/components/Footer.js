import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Styles.module.css';

const Footer = () => {
  return (
    <footer id="contact" className={`bg-dark text-white py-4 ${styles.footer}`}>
      <Container>
        <Row className="justify-content-center text-start">
          <Col lg={6} className="mb-3">
            <h4>Contact Us</h4>
            <p>Sunan Giri GG. I No. 11, Rejomulyo, Kediri, Jawa Timur 64129</p>
            <p><a href="tel:+6281318894994">0813 1889 4994</a></p>
            <p><a href="mailto:marketing@kediritechnopark.com">marketing@kediritechnopark.com</a></p>
            <p><a href="https://instagram.com/kediri.technopark" target="_blank" rel="noopener noreferrer">@kediri.technopark</a></p>
            <p><a href="https://kediritechnopark.com" target="_blank" rel="noopener noreferrer">www.KEDIRITECHNOPARK.com</a></p>
            
          </Col>
          <Col lg={6}>
            <div className="footer-widget">
              <h4>About Our Company</h4>
              <div className={styles.logo}>
                <img src="https://kediritechnopark.com/kediri-technopark-logo-white.png" alt="Logo" />
              </div>
              <p>Kediri Technopark adalah pusat pengembangan inovasi digital dan aplikasi untuk masyarakat dan pelaku usaha.</p>
            </div>
          </Col>
          <Col lg={12} className="mt-3">
            <div className="copyright-text">
              <p>&copy; 2025 Kediri Technopark. All Rights Reserved.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
