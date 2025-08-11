import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ServicesSection = () => {
  return (
    <section id="services" className="services py-5">
      <Container>
        <div className="section-heading  mb-4">
          <h4>OUR <em>SERVICES</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Kami menyediakan berbagai solusi teknologi untuk mendukung transformasi digital bisnis dan masyarakat.</p>
        </div>
        <Row>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Mesthicon</Card.Title>
                <Card.Text>Layanan instalasi jaringan, CCTV, dan infrastruktur teknologi.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Techcare</Card.Title>
                <Card.Text>Perakitan komputer, servis, dan konsultasi infrastruktur digital.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Gawechno</Card.Title>
                <Card.Text>Pembuatan software, website, sistem otomatisasi bisnis, dan aplikasi AI.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ServicesSection;