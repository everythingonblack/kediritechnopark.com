import React, { useEffect, useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ product, setPostLoginAction, setShowedModal }) => {
  const [inCart, setInCart] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [selectedChildIds, setSelectedChildIds] = useState([]);

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

    document.cookie = `itemsId=${JSON.stringify(updatedItems)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  };

const onCheckout = () => {
  const tokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='));
  const token = tokenCookie ? tokenCookie.split('=')[1] : '';

  if (!tokenCookie) {
    setPostLoginAction(() => () => onCheckout());
    setShowedModal('login');
    return;
  }

  // Jika punya children, tampilkan pilihan
  if (product.children && product.children.length > 0) {
    setShowChildSelector(true);
    return;
  }

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

  // Tambahkan product.id jika belum ada
  if (!items.includes(product.id)) {
    items.push(product.id);
  }

  const itemsParam = JSON.stringify(items);

  window.location.href = `http://localhost:3002/?token=${token}&itemsId=${itemsParam}&redirect_uri=http://localhost:3000/products&redirect_failed=http://localhost:3000`;
};

const onConfirmChildren = () => {
  const tokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='));
  const token = tokenCookie ? tokenCookie.split('=')[1] : '';

  if (selectedChildIds.length === 0) {
    alert('Pilih minimal satu produk');
    return;
  }

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

  // Gabungkan items dari cookie dengan selectedChildIds
  const mergedItems = Array.from(new Set([...items, ...selectedChildIds]));

  const itemsParam = JSON.stringify(mergedItems);

  window.location.href = `http://localhost:3002/?token=${token}&itemsId=${itemsParam}&redirect_uri=http://localhost:3000/products&redirect_failed=http://localhost:3000`;
};


  const priceColor = product.price === 0 ? '#059669' : '#2563eb';

  return (
    <div className={styles.container}>

      {/* ✅ Tampilan utama disembunyikan jika sedang memilih child */}
      {!showChildSelector && (
        <>
          <div
            className={styles.image}
            style={{ backgroundImage: `url(${product.image})` }}
          ></div>

          <div className={styles.headerRow}>
            <h2 className={styles.title}>{product.name}</h2>
            <div className={styles.price} style={{ color: priceColor }}>
              {product.price == null
                ? 'Pay-As-You-Go'
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
              <img
                src={'/cart-shopping-svgrepo-com.svg'}
                alt={inCart ? 'Hapus' : 'Tambah'}
                style={{ width: '21px', height: '21px', marginRight: '7px' }}
              />
              {inCart ? 'Hapus' : 'Tambah'}
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
        </>
      )}

      {/* ✅ UI pemilihan child */}
      {showChildSelector && (
        <div className={styles.childSelector}>
          <h3>Pilih Paket</h3>
          {product.children.map(child => (
            <label key={child.id} className={styles.childProduct} style={{ display: 'block', marginBottom: '8px' }}>
              <input
                type="checkbox"
                value={child.id}
                checked={selectedChildIds.includes(child.id)}
                onChange={e => {
                  const checked = e.target.checked;
                  if (checked) {
                    setSelectedChildIds(prev => [...prev, child.id]);
                  } else {
                    setSelectedChildIds(prev => prev.filter(id => id !== child.id));
                  }
                }}
              />
              {' '}
              {child.name} — Rp {parseInt(child.price || 0).toLocaleString('id-ID')}
            </label>
          ))}

          <p style={{ marginTop: '10px' }}>
            <strong>Total Harga:</strong>{' '}
            Rp {selectedChildIds
              .map(id => {
                const found = product.children.find(child => child.id === id);
                return found ? found.price || 0 : 0;
              })
              .reduce((a, b) => a + b, 0)
              .toLocaleString('id-ID')}
          </p>

          <div className={styles.buttonGroup}>
            
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => {
                setShowChildSelector(false);
                setSelectedChildIds([]);
              }}
            >
              Kembali
            </button>
            <button
              className={`${styles.button} ${styles.confirmButton}`}
              onClick={onConfirmChildren}
            >
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
