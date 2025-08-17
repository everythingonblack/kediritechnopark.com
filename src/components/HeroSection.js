// HeroSection.jsx — 2025 refresh using React-Bootstrap + CSS Module
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const goProducts = () => navigate('/products');
  const goAcademy = () => navigate('/#services');

  return (
    <section className={`${styles.hero} pt-3 pb-3`}
      aria-label="Kediri Technopark hero section">
      <Container className={styles.heroContainer}>
        <Row className="align-items-center gy-3">
          {/* Text first for mobile and desktop for clarity */}
          <Col xs={{ order: 0 }} lg={{ span: 8, order: 1 }} xl={{ span: 7, order: 1 }}>
            <div className={styles.copyWrap}>
              <h1 className={styles.title}>
                KATALIS KARIR DAN BISNIS DIGITAL
              </h1>
              <p className={styles.lead}>
                Kami adalah ekosistem tempat mimpi digital tumbuh dan masa depan dibentuk. Di sinilah semangat belajar bertemu dengan inovasi, dan ide-ide muda diberi ruang untuk berkembang. Lebih dari sekadar tempat, kami adalah rumah bagi talenta, teknologi, dan transformasi. Mari jelajahi dunia digital, bangun karir, dan ciptakan solusi — semua dimulai dari sini.
              </p>
              <div className={styles.ctaGroup}>
                <Button className={styles.ctaPrimary} onClick={goProducts}>
                  Explore Products
                </Button>
                <Button variant="light" className={styles.ctaSecondary} onClick={goAcademy}>
                  View Academy
                </Button>
              </div>
            </div>
          </Col>
          <Col xs={{ order: 1 }} lg={{ span: 4, order: 2 }} xl={{ span: 5, order: 2 }}>
            <div className={styles.imageWrap}>
              <div className={styles.imageFrame}>
                <img
                  src="https://kediritechnopark.com/assets/hero.png"
                  alt="Ekosistem digital Kediri Technopark"
                  className={`img-fluid ${styles.heroImage}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;