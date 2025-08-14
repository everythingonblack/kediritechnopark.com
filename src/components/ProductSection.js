import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Styles.module.css';
import processProducts from '../helper/processProducts';


const ProductSection = ({ hoveredCard, setHoveredCard, setSelectedProduct, setShowedModal, productSectionRef, setWillDo }) => {
  const [products, setProducts] = useState([]);
// Define this function outside useEffect so it can be called anywhere


// Inside your component
useEffect(() => {
  fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'product' }),
  })
    .then(res => res.json())
    .then(data => {
      const enrichedData = processProducts(data);
      setProducts(enrichedData);
    })
    .catch(err => console.error('Fetch error:', err));
}, []);

  return (

    <section id="services" className="services pt-5" ref={productSectionRef}>
      <Container>
        <div className="section-heading  mb-4">
          <h4>OUR <em>PRODUCTS</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Kami menyediakan berbagai solusi teknologi untuk mendukung transformasi digital bisnis dan masyarakat.</p>
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

export default ProductSection;
