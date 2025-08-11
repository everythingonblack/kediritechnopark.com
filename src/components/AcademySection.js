import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Styles.module.css';

const AcademySection = ({hoveredCard, setHoveredCard, setSelectedProduct, setShowedModal, courseSectionRef}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'course' }),
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (

    <section id="services" className="services pt-5" ref={courseSectionRef}>
      <Container>
        <div className="section-heading  mb-4">
          <h4>OUR <em>ACADEMY PROGRAM</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Academy Program adalah wadah belajar digital untuk anak-anak dan remaja. Didesain interaktif, kreatif, dan gratis — setiap modul membekali peserta dengan keterampilan masa depan, dari teknologi dasar hingga coding dan proyek nyata.</p>
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
                      <h3 className={styles.courseTitle}>{product.name}</h3>
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
                  </div>
                </div>
              ))}
        </div>
      </Container>
    </section>
  );
};

export default AcademySection;
