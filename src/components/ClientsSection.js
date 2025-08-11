import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import styles from './Styles.module.css';

const ClientsSection = () => {
  const logos = [
    'dermalounge.jpg',
    'suar.avif',
    'kloowear.png',
    'psi.png',
  ];

  return (
    <section id="clients" className="the-clients section py-5">
      <Container>
        <Row>
          <Col>
            <div className="section-heading mb-4">
              <h4>TRUSTED BY <em>OUR CLIENTS</em></h4>
              <p>We are proud to work with these amazing brands and organizations.</p>
            </div>
            <div id="clients-carousel" className="d-flex justify-content-left flex-wrap">
              {logos.map((logo, index) => (
                <div className={`${styles.clientLogoWrapper} m-2`} key={index}>
                  <Image
                    src={`https://kediritechnopark.com/assets/${logo}`}
                    fluid
                    className={styles.clientLogo}
                  />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ClientsSection;
