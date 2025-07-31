import React, { useEffect, useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ product, setPostLoginAction, setShowedModal }) => {
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const existingCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('itemsId='));
    let items = [];
    if (existingCookie) {
      try {
        const value = decodeURIComponent(existingCookie.split('=')[1]);
        items = JSON.parse(value);
        if (!Array.isArray(items)) items = [];
      } catch (e) {
        items = [];
      }
    }
    setInCart(items.includes(product.id));
  }, [product.id]);

  const onSetCart = () => {
    const existingCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('itemsId='));

    let items = [];

    if (existingCookie) {
      try {
        const value = decodeURIComponent(existingCookie.split('=')[1]);
        items = JSON.parse(value);
        if (!Array.isArray(items)) items = [];
      } catch (e) {
        items = [];
      }
    }

    let updatedItems;
    if (items.includes(product.id)) {
      updatedItems = items.filter(id => id !== product.id); // remove
      setInCart(false);
    } else {
      updatedItems = [...items, product.id]; // add
      setInCart(true);
    }

    document.cookie = `itemsId=${JSON.stringify(updatedItems)}; path=/; max-age=${7 * 24 * 60 * 60
      }`;
  };

  const onCheckout = () => {
    // Ambil token dari cookie
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    // Ambil itemsId dari cookie
    const itemsCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('itemsId='));

    let items = [];
    if (itemsCookie) {
      try {
        items = JSON.parse(itemsCookie.split('=')[1]);
        if (!Array.isArray(items)) items = [];
      } catch (e) {
        items = [];
      }
    }

    if (!items.includes(product.id)) {
      items.push(product.id);
    }
    // Encode items ke string untuk query param
    const itemsParam = JSON.stringify(items);

    if (!tokenCookie) {
      setPostLoginAction(() => () => onCheckout()); // remember intent
      setShowedModal('login');
      return;
    }

    // Redirect dengan token dan itemsId di query
    window.location.href = `http://localhost:3001/?token=${token}&itemsId=${itemsParam}&redirect_uri=http://localhost:3000/courses&redirect_failed=http://localhost:3000`;
  };


  // Override harga warna jika free
  const priceColor = product.price === 0 ? '#059669' : '#2563eb';

  return (
    <div className={styles.container}>
      <div className={styles.image}>📦</div>

      <div className={styles.headerRow}>
        <h2 className={styles.title}>{product.name}</h2>
        <div className={styles.price} style={{ color: priceColor }}>
          {product.price === 0
            ? 'Free'
            : `Rp ${parseInt(product.price).toLocaleString('id-ID')}`}
        </div>
      </div>

      <p className={styles.description}>{product.description}</p>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.addToCartButton}`}
          onClick={onSetCart}
          onMouseOver={e => (e.target.style.backgroundColor = '#facc15')}
          onMouseOut={e => (e.target.style.backgroundColor = '#fbbf24')}
        >
          {inCart ? 'Hapus dari Keranjang' : '+ Keranjang'}
        </button>
        <button
          className={`${styles.button} ${styles.checkoutButton}`}
          onClick={onCheckout}
          onMouseOver={e => (e.target.style.backgroundColor = '#1d4ed8')}
          onMouseOut={e => (e.target.style.backgroundColor = '#2563eb')}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
