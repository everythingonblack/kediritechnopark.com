import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onCardClick, isCenter, canHover }) => {
  return (
    <div
      className={`${styles.card} ${isCenter ? styles.isCenter : ''} ${canHover ? styles.canHover : ''}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className={styles.cover}
        onError={(e) => { e.currentTarget.src = '/assets/images/placeholder-product.png'; }}
      />

      <div
        className={styles.overlay}
        onClick={(e) => {
          if (isCenter) {
            // Clicks on overlay open detail; prevent parent selection
            e.stopPropagation();
            onCardClick && onCardClick(product);
          }
        }}
      >
        <div className={styles.overlayInner}>
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.meta}> 
            <p className={styles.description}>{product.description}</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.detailButton}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCardClick && onCardClick(product); }}
              >
                Detail
              </button>
              <button
                className={styles.buyButton}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCardClick && onCardClick(product); }}
              >
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
