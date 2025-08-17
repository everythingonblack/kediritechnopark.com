import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './ServicesSection.module.css';
import { Network, Wrench, Code } from 'lucide-react';
import shared from './Styles.module.css';
import useInView from '../hooks/useInView';

const services = [
  {
    icon: <Network size={28} />,
    title: "Meshticon",
    theme: "Network",
    description: "Instalasi jaringan dan infrastruktur terstruktur yang memastikan konektivitas andal dan keamanan aset Anda, sehingga operasional bisnis berjalan mulus tanpa gangguan.",
  },
  {
    icon: <Wrench size={28} />,
    title: "Techcare",
    theme: "Support",
    description: "Menyediakan layanan perakitan, servis, dan konsultasi perangkat keras untuk menjamin kinerja optimal dan penanganan masalah yang responsif, sehingga produktivitas tim Anda terjaga dan investasi teknologi Anda lebih awet.",
  },
  {
    icon: <Code size={28} />,
    title: "Gawechno",
    theme: "Software",
    description: "Pengembangan software, website, dan sistem otomasi kustom yang mengubah proses manual menjadi lebih efisien dan cerdas, memungkinkan Anda menekan biaya operasional dan membuka jalan bagi inovasi bisnis.",
  },
];

const ServicesSection = () => {
  const { ref, inView } = useInView();
  return (
    <section id="services" ref={ref} className={`${styles.blueprintContainer} ${shared.revealSection} ${inView ? shared.isVisible : ''}`}>
      <div className={styles.blueprintGrid}></div>
      <div className={styles.contentWrapper}>
        <Container>
          <div className={styles.sectionHeader}>
            {/* Judul diubah */}
            <h2 className={styles.sectionTitle}>Layanan Kami</h2>
            <img src="/assets/images/heading-line-dec.png" alt="" className={styles.headingLine} />
            <p>
              Kami menyediakan berbagai solusi teknologi untuk mendukung transformasi digital bisnis dan masyarakat.
            </p>
          </div>
          <Row className="gy-4 justify-content-center">
            {services.map((service, index) => (
              <Col key={index} lg={4} md={6}>
                <div className={styles.specCard}>
                  {/* Stuktur header disederhanakan */}
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>{service.icon}</div>
                    <h3 className={styles.cardTitle}>{service.title}</h3>
                    <div className={styles.themePill}>
                      {/* Urutan dibalik: titik dulu, baru tulisan */}
                      <span className={styles.glowingDot}></span>
                      <span>{service.theme}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardDescription}>{service.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default ServicesSection;
