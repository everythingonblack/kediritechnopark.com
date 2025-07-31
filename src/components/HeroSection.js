import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = () => {
  return (
    <section className="hero-section pt-5 bg-light">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h1>KATALIS KARIR DAN BISNIS DIGITAL</h1>
            <p>Kami adalah ekosistem tempat mimpi digital tumbuh dan masa depan dibentuk. Di sinilah semangat belajar bertemu dengan inovasi, dan ide-ide muda diberi ruang untuk berkembang. Lebih dari sekadar tempat, kami adalah rumah bagi talenta, teknologi, dan transformasi. Mari jelajahi dunia digital, bangun karir, dan ciptakan solusi — semua dimulai dari sini.</p>
            <div className="d-flex gap-3">
              <Button variant="outline-primary" href="https://instagram.com/kediri.technopark" target="_blank">Instagram</Button>
              <Button variant="outline-success" href="tel:+6281318894994">WhatsApp</Button>
            </div>
          </Col>
          <Col lg={6}>
            <img src="https://kediritechnopark.com/assets/images/gambar1.png" alt="Hero Image" className="img-fluid" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;