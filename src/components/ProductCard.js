import React from 'react';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onCardClick, isCenter, canHover, onCollapse }) => {
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
          // Collapse overlay when clicking on the overlay background (not buttons)
          if (isCenter && canHover && onCollapse) {
            // Check if the click target is the overlay itself, not a button
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              onCollapse();
            }
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
