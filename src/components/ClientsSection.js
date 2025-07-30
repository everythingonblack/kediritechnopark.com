import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const ClientsSection = () => {
  return (
    <section id="clients" className="the-clients section py-5">
      <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }}>
            <div className="section-heading text-center mb-4">
              <h4>TRUSTED BY <em>OUR CLIENTS</em></h4>
              <img src="/assets/images/heading-line-dec.png" alt="" className="mb-3" />
              <p>We are proud to work with these amazing brands and organizations.</p>
            </div>
            <div id="clients-carousel" className="d-flex justify-content-center flex-wrap">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="client-logo-wrapper m-2">
                  <Image src={`/assets/images/client-logo${num}.png`} alt={`Client ${num}`} fluid />
                </div>
              ))}</div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ClientsSection;