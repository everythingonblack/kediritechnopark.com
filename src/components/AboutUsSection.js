import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './AboutUsSection.module.css';
import { CheckCircle } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground'; // Impor komponen baru
import shared from './Styles.module.css';
import useInView from '../hooks/useInView';

const AboutUsSection = () => {
  const { ref, inView } = useInView();
  return (
    <section id="about" ref={ref} style={{scrollMarginTop: '65px'}} className={`${styles.aboutSection} ${shared.revealSection} ${inView ? shared.isVisible : ''}`}>
      <AnimatedBackground /> {/* Komponen animasi sebagai latar belakang */}
      <div className={styles.contentWrapper}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>Tentang Kami</h2>
                <p className={styles.paragraph}>
                  Kediri Technopark adalah ekosistem inovasi yang didedikasikan untuk mendorong pertumbuhan talenta digital dan akselerasi bisnis teknologi. Kami menyediakan fasilitas, program, dan jaringan yang dibutuhkan untuk mengubah ide brilian menjadi solusi nyata yang berdampak.
                </p>
                <ul className={styles.valueList}>
                  <li><CheckCircle size={20} className={styles.listIcon} /><span>Inovasi Berkelanjutan</span></li>
                  <li><CheckCircle size={20} className={styles.listIcon} /><span>Kolaborasi Komunitas</span></li>
                  <li><CheckCircle size={20} className={styles.listIcon} /><span>Pemberdayaan Talenta</span></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default AboutUsSection;
