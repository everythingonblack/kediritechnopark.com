import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Styles.module.css';
import useInView from '../hooks/useInView';

const AcademySection = ({setSelectedProduct, setShowedModal, courseSectionRef, setWillDo}) => {
  const [products, setProducts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  useEffect(() => {
    // Fetch all items to compute module/sessions reliably, then filter courses client-side
    fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(res => res.json())
      .then(data => {
        const all = Array.isArray(data) ? data : [];
        const moduleCountMap = {};
        const sessionsCountMap = {};
        all.forEach(item => {
          const parentId = item?.sub_product_of;
          if (parentId) {
            moduleCountMap[parentId] = (moduleCountMap[parentId] || 0) + 1;
            const s = Number(item?.sessions || item?.session_count || 0);
            sessionsCountMap[parentId] = (sessionsCountMap[parentId] || 0) + (isNaN(s) ? 0 : s);
          }
        });
        const coursesOnly = all.filter(p => (p?.type || '').toLowerCase() === 'course');
        const enriched = coursesOnly.map(p => ({
          ...p,
          module_count: p?.module_count ?? p?.modules ?? moduleCountMap[p.id] ?? 0,
          session_count: p?.session_count ?? p?.sessions ?? sessionsCountMap[p.id] ?? 0,
        }));
        setProducts(enriched);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const { ref, inView } = useInView();
  return (

    <section id="academy" className={`services pt-5 ${styles.academySection} ${styles.revealSection} ${inView ? styles.isVisible : ''}`} ref={(el) => {
      if (typeof courseSectionRef === 'function') courseSectionRef(el);
      if (ref) ref.current = el;
    }}>
      <Container>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>Academy</div>
          <h2 className={styles.sectionTitle}>Our Academy Program</h2>
          <div className={styles.sectionRule} />
          <p className={styles.sectionSubtitle}>
            Academy Program adalah wadah belajar digital untuk anak-anak dan remaja. Didesain interaktif, kreatif, dan gratis — setiap modul membekali peserta dengan keterampilan masa depan, dari teknologi dasar hingga coding dan proyek nyata.
          </p>
        </div>

        <div className={styles.coursesGrid}>
          {products &&
            products[0]?.name &&
            products
              .map(product => (
                <div
                  key={product.id}
                  className={`${styles.courseCard} ${hoveredCard === product.id ? styles.courseCardHover : ''}`}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowedModal('product');
                  }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div>
                    <div className={styles.courseImage} style={{ backgroundImage: `url(${product.image})` }}>
                      {product.price === 0 && (
                        <span className={styles.courseLabel}>Free</span>
                      )}
                    </div>
                    <div className={styles.courseContentTop}>
                      <div className={styles.titleRow}>
                        <h3 className={styles.courseTitle}>{product.name}</h3>
                        <div className={styles.pillRow}>
                          <span className={`${styles.pill} ${styles.pillModules}`}>{Number(product?.module_count || 0)} Modul</span>
                          <span className={`${styles.pill} ${styles.pillSessions}`}>{Number(product?.session_count || 0)} Sesi</span>
                        </div>
                      </div>
                      <div className={styles.titleSeparator} />
                      <p className={styles.courseDesc}>{product.description}</p>
                    </div>
                  </div>
                  <div className={styles.courseContentBottom}>
                    <div className={styles.coursePrice}>
                      <span
                        className={
                          product.price === 0
                            ? styles.freePrice
                            : styles.currentPrice
                        }
                      >
                        {product.price == null
                          ? 'Pay-As-You-Go'
                          : `Rp ${product.price.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <button className={`${styles.enrollButton}`}
                    onClick={() => {
                    setSelectedProduct(product);
                    setShowedModal('product');
                    setWillDo('checkout');
                  }}>Daftar</button>
                  </div>
                </div>
              ))}
        </div>
      </Container>
    </section>
  );
};

export default AcademySection;
