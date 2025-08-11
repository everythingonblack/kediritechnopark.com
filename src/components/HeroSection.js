// HeroSection.jsx — 2025 refresh using React-Bootstrap + CSS Module
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <section className={`${styles.hero} pt-5`}
      aria-label="Kediri Technopark hero section">
      <Container>
        <Row className="align-items-center gy-5">
          {/* Image on top for mobile, text first on lg+ */}
          <Col xs={{ order: 1 }} lg={{ span: 6, order: 1 }}>
            <div className={styles.copyWrap}>
              <h1 className={styles.title}>
                KATALIS KARIR DAN BISNIS DIGITAL
              </h1>
              <p className={styles.lead}>
                Kami adalah ekosistem tempat mimpi digital tumbuh dan masa depan dibentuk. Di sinilah semangat belajar bertemu dengan inovasi, dan ide-ide muda diberi ruang untuk berkembang. Lebih dari sekadar tempat, kami adalah rumah bagi talenta, teknologi, dan transformasi. Mari jelajahi dunia digital, bangun karir, dan ciptakan solusi — semua dimulai dari sini.
              </p>
            </div>
          </Col>
          <Col xs={{ order: 0 }} lg={{ span: 6, order: 2 }}>
            <div className={styles.imageWrap}>
              <img
                src="https://kediritechnopark.com/assets/hero.png"
                alt="Ekosistem digital Kediri Technopark"
                className={`img-fluid ${styles.heroImage}`}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.glow} aria-hidden="true" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;