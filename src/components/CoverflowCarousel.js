import React, { useState, useEffect, useRef } from 'react';
import styles from './CoverflowCarousel.module.css';
import ProductCard from './ProductCard';

const CoverflowCarousel = ({ products, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'spread', 'ready'
  const [shiftDirection, setShiftDirection] = useState(null); // 'left' | 'right' | null
  const [isDragging, setIsDragging] = useState(false);
  const [edgeEnter, setEdgeEnter] = useState(null); // 'left' | 'right' | null
  const containerRef = useRef(null);
  const dragStartX = useRef(null);
  const hasSwiped = useRef(false);

  // Handle navigation
  const goToProduct = (index, dir = null) => {
    if (dir) {
      setShiftDirection(dir);
      // mark which edge is entering for a short time to trigger ease-in
      setEdgeEnter(dir === 'left' ? 'right' : 'left');
      setTimeout(() => setEdgeEnter(null), 80);
      setTimeout(() => setShiftDirection(null), 820);
    }
    setCurrentIndex(index);
  };

  const nextProduct = () => {
    const nextIndex = (currentIndex + 1) % products.length;
    goToProduct(nextIndex, 'right');
  };

  const prevProduct = () => {
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    goToProduct(prevIndex, 'left');
  };

  // Drag/Swipe handlers
  const onPointerDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartX.current = x;
    hasSwiped.current = false;
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - (dragStartX.current ?? x);
    const threshold = 60;
    if (!hasSwiped.current && Math.abs(dx) > threshold) {
      if (dx > 0) {
        prevProduct();
      } else {
        nextProduct();
      }
      hasSwiped.current = true;
      dragStartX.current = x;
    }
  };

  const onPointerUp = () => {
    setIsDragging(false);
    dragStartX.current = null;
    hasSwiped.current = false;
  };

  // Handle dot navigation
  const goToProductByIndex = (index) => {
    if (index === currentIndex) return;
    const dir = index > currentIndex ? 'right' : 'left';
    goToProduct(index, dir);
  };

  // Collapse overlay for center card
  const collapseOverlay = () => {
    // Reset animation state to force collapse
    setAnimationState('spread');
    setTimeout(() => {
      setAnimationState('ready');
    }, 50);
  };

  // Initialize carousel with spread effect when products are available
  useEffect(() => {
    if (!products || products.length === 0) return;
    setAnimationState('initial');
    const spreadTimer = setTimeout(() => {
      setAnimationState('spread');
    }, 100);

    const readyTimer = setTimeout(() => {
      setAnimationState('ready');
    }, 1000);

    return () => {
      clearTimeout(spreadTimer);
      clearTimeout(readyTimer);
    };
  }, [products.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        prevProduct();
      } else if (e.key === 'ArrowRight') {
        nextProduct();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, products.length]);

  // Don't render if no products
  if (products.length === 0) {
    return <div className={styles.container}>Tidak ada produk tersedia</div>;
  }

  // Prefer 5-slot coverflow when data memadai; fallback ke jumlah ganjil saat produk < 5
  let positions = [];
  if (products.length >= 5) {
    positions = [-2, -1, 0, 1, 2];
  } else {
    const visibleCountRaw = Math.min(5, products.length);
    const visibleCount = visibleCountRaw % 2 === 0 ? Math.max(1, visibleCountRaw - 1) : visibleCountRaw;
    const half = Math.floor(visibleCount / 2);
    positions = Array.from({ length: visibleCount }, (_, i) => i - half);
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div className={`${styles.carouselWrapper} ${shiftDirection === 'left' ? styles.shiftingLeft : ''} ${shiftDirection === 'right' ? styles.shiftingRight : ''}`}>
        {positions.map((position) => {
          const count = products.length;
          const productIndex = (currentIndex + position + count) % count;
          const product = products[productIndex];
          
          // Determine position class (clamped to available classes)
          let positionClass = '';
          if (position <= -2) positionClass = styles.positionNeg2;
          else if (position === -1) positionClass = styles.positionNeg1;
          else if (position === 0) positionClass = styles.position0;
          else if (position === 1) positionClass = styles.position1;
          else if (position >= 2) positionClass = styles.position2;

          // Determine entering class for edge items (works for 3 or 5 slots)
          const maxEdge = positions.length > 0 ? Math.max(...positions) : 2; // 2 for 5 slots, 1 for 3 slots
          const enteringClass = edgeEnter === 'right' && position === maxEdge
            ? styles.enterFromRight
            : edgeEnter === 'left' && position === -maxEdge
            ? styles.enterFromLeft
            : '';

          return (
            <div
              key={`prod_${(product && product.id != null) ? product.id : productIndex}`}
              className={`${styles.cardContainer} ${positionClass} ${
                animationState === 'initial' ? styles.initial :
                animationState === 'spread' ? styles.spread : ''
              }`}
              onClick={() => { 
                // Only trigger navigation if this is not the center card
                // or if it's the center card but not in hover state (overlay not visible)
                const isCenter = position === 0;
                const canHover = isCenter && animationState === 'ready' && !shiftDirection && !isDragging;
                if (position !== 0 || (position === 0 && (!canHover || animationState !== 'ready' || shiftDirection || isDragging))) {
                  goToProduct(productIndex, position > 0 ? 'right' : (position < 0 ? 'left' : null));
                }
              }}
            >
              <div className={styles.cardShadow} aria-hidden="true"></div>
              <div className={styles.cardWrapper}>
                <ProductCard 
                  product={product} 
                  onCardClick={(p,d) => { onCardClick && onCardClick(p,d); }}
                  isCenter={position === 0}
                  canHover={position === 0 && animationState === 'ready' && !shiftDirection && !isDragging}
                  onCollapse={position === 0 ? collapseOverlay : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button className={styles.navButton} onClick={prevProduct}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className={styles.navButton} onClick={nextProduct}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dots indicator */}
      {products.length > 1 && (
        <div className={styles.dotsContainer}>
          {products.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToProductByIndex(index)}
              
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoverflowCarousel;
