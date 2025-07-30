import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer id="contact" className="bg-dark text-white py-4">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} className="text-center mb-3">
            <h4>Contact Us</h4>
            <p>Sunan Giri GG. I No. 11, Rejomulyo, Kediri, Jawa Timur 64129</p>
            <p><a href="tel:+6281318894994" className="text-white">0813 1889 4994</a></p>
            <p><a href="mailto:marketing@kediritechnopark.com" className="text-white">marketing@kediritechnopark.com</a></p>
            <p><a href="https://instagram.com/kediri.technopark" target="_blank" rel="noopener noreferrer" className="text-white">@kediri.technopark</a></p>
            <p><a href="https://kediritechnopark.com" target="_blank" rel="noopener noreferrer" className="text-white">www.KEDIRITECHNOPARK.com</a></p>
            <div className="mt-3">
              <a href="https://wa.me/6281318894994" target="_blank" rel="noopener noreferrer" className="me-3 text-white fs-4">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://instagram.com/kediri.technopark" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </Col>
          <Col lg={6} className="text-center">
            <div className="footer-widget">
              <h4>About Our Company</h4>
              <div className="logo mb-3">
                <img src="/assets/images/logo-white.png" alt="Logo" className="img-fluid" />
              </div>
              <p>Kediri Technopark adalah pusat pengembangan inovasi digital dan aplikasi untuk masyarakat dan pelaku usaha.</p>
            </div>
          </Col>
          <Col lg={12} className="text-center mt-3">
            <div className="copyright-text">
              <p>
                &copy; 2025 Kediri Technopark. All Rights Reserved.<br />
                Design by <a href="https://templatemo.com/" target="_blank" rel="noopener noreferrer" className="text-white">TemplateMo</a><br />
                Distributed by <a href="https://themewagon.com/" target="_blank" rel="noopener noreferrer" className="text-white">ThemeWagon</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;