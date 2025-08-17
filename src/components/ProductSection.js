import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import styles from './ProductSection.module.css';
import CoverflowCarousel from './CoverflowCarousel';
import processProducts from '../helper/processProducts';
import shared from './Styles.module.css';
import useInView from '../hooks/useInView';

const ProductSection = ({ setSelectedProduct, setShowedModal, productSectionRef, setWillDo }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

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
        const processed = processProducts(data);
        setProducts(processed);
        setFilteredProducts(processed);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category).filter(Boolean))];

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  // Handle product selection for detail view
  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowedModal('product');
    setWillDo('checkout');
  };

  const { ref, inView } = useInView();
  return (
    <section id="products" style={{scrollMarginTop: '65px' }} className={`${styles.productSection} ${shared.revealSection} ${inView ? shared.isVisible : ''}`} ref={(el) => {
      if (typeof productSectionRef === 'function') productSectionRef(el);
      if (ref) ref.current = el;
    }}>
      <Container>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Produk Unggulan</h2>
          <p>Produk digital siap pakai untuk mempercepat pertumbuhan bisnis Anda.</p>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className={styles.filterContainer}>
            <div className={styles.filterWrapper}>
              <button 
                className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Semua Produk
              </button>
              {categories.filter(cat => cat !== 'all').map(category => (
                <button 
                  key={category}
                  className={`${styles.filterBtn} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Coverflow Carousel */}
        <div className={styles.carouselContainer}>
          {filteredProducts.length > 0 ? (
            <CoverflowCarousel 
              products={filteredProducts} 
              onCardClick={handleViewDetail} 
            />
          ) : (
            <div className={styles.noProducts}>
              <p>Tidak ada produk yang tersedia saat ini.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;
