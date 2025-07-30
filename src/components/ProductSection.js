import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProductSection = () => {
  return (
    <section id="produk" className="product-section py-5 bg-light">
      <Container>
        <div className="section-heading text-center mb-4">
          <h4>OUR <em>PRODUCT</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Kami menyediakan berbagai solusi teknologi untuk mendukung transformasi digital bisnis dan masyarakat.</p>
        </div>
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="d-flex overflow-auto">
              <Card className="text-center me-3" style={{ minWidth: '200px' }}>
                <Card.Img variant="top" src="/assets/images/mr.kyaiiphone.png" alt="Mr. Kyai" />
                <Card.Body>
                  <Card.Title>MR. KYAI</Card.Title>
                </Card.Body>
              </Card>
              <Card className="text-center me-3" style={{ minWidth: '200px' }}>
                <Card.Img variant="top" src="/assets/images/kedaimasteriphone.png" alt="Kedai Master" />
                <Card.Body>
                  <Card.Title>KEDAIMASTER</Card.Title>
                </Card.Body>
              </Card>
              <Card className="text-center" style={{ minWidth: '200px' }}>
                <Card.Img variant="top" src="/assets/images/mayageniphone.png" alt="Mayagen" />
                <Card.Body>
                  <Card.Title>MAYAGEN</Card.Title>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;