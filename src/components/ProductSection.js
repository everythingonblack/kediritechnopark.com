import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './Styles.module.css';


const ProductSection = ({ hoveredCard, setHoveredCard, setSelectedProduct, setShowedModal, productSectionRef }) => {
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetch('https://bot.kediritechnopark.com/webhook/store-dev/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'product' }),
  })
    .then(res => res.json())
    .then(data => {
      const parentMap = {};
      const childrenMap = {};

      // Pisahkan parent dan child
      data.forEach(product => {
        if (product.sub_product_of) {
          const parentId = product.sub_product_of;
          if (!childrenMap[parentId]) childrenMap[parentId] = [];
          childrenMap[parentId].push(product);
        } else {
          parentMap[product.id] = {
            ...product,
            children: []
          };
        }
      });

      // Pasang children ke parent
      Object.keys(childrenMap).forEach(parentId => {
        const parent = parentMap[parentId];
        if (parent) {
          parent.children = childrenMap[parentId];
        }
      });

      // Ambil parent saja
      const enrichedData = Object.values(parentMap);

      setProducts(enrichedData);
    })
    .catch(err => console.error('Fetch error:', err));
}, []);

  return (

    <section id="services" className="services pt-5">
      <Container>
        <div className="section-heading text-center mb-4">
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
                <div className={styles.courseImage} style={{ backgroundImage: `url(${product.image})` }}>
                  {product.price === 0 && (
                    <span className={styles.courseLabel}>Free</span>
                  )}
                </div>
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{product.name}</h3>
                  <p className={styles.courseDesc}>{product.description}</p>
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

export default ProductSection;
