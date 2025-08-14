import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Styles.module.css';

const AcademySection = ({setSelectedProduct, setShowedModal, courseSectionRef, setWillDo}) => {
  const [products, setProducts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  
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
                    <button className="px-4 py-2 rounded-pill text-white" style={{ background: 'linear-gradient(to right, #6a59ff, #8261ee)', border: 'none' }} 
                    onClick={() => {
                    setSelectedProduct(product);
                    setShowedModal('product');
                    setWillDo('checkout');
                  }}>Beli</button>
                  </div>
                </div>
              ))}
        </div>
      </Container>
    </section>
  );
};

export default AcademySection;
