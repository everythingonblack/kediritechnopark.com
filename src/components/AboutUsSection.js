import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const AboutUsSection = () => {
  return (
    <section id="about" className="about-us section pt-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="section-heading">
              <span style={{ color: '#6a59ff', fontWeight: 'bold' }}>Kediri Technopark</span>
              <h2 className="mt-2">ABOUT US</h2>
              <img src="/assets/images/heading-line-dec.png" alt="" />
              <p className="mt-3">
                <strong>Kediri Technopark: Katalis Inovasi dan Pusat Pertumbuhan Digital Lokal</strong><br /><br />
                Kediri Technopark adalah inisiatif strategis yang bertujuan membangun ekosistem teknologi dan inovasi yang dinamis di Kediri, Jawa Timur. Kami menyediakan infrastruktur, sumber daya, dan komunitas pendukung yang dibutuhkan untuk mendorong pertumbuhan startup dan bisnis IT yang sudah ada.<br /><br />
                Dengan misi memberdayakan talenta lokal, menjembatani teknologi dan industri, serta mempercepat transformasi digital, Kediri Technopark berkomitmen menjadi penggerak kemajuan ekonomi dan teknologi, baik di tingkat lokal maupun nasional.
              </p>
              <div className="mt-4 d-flex gap-3">
                <Button href="konsultasi.html" className="px-4 py-2 rounded-pill text-white" style={{ background: 'linear-gradient(to right, #6a59ff, #8261ee)', border: 'none' }}>
                  Konsultasi
                </Button>
                <Button href="https://wa.me/6281318894994" target="_blank" variant="outline-success" className="px-4 py-2 rounded-pill">
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </Button>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="right-image">
              <img src="/assets/images/about-right-dec.png" alt="" className="img-fluid" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutUsSection;