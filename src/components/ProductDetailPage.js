import React, { useState } from 'react';
import styles from './ProductDetail.module.css';

const ProductDetail = ({ subscriptions, product, requestLogin, setShowedModal }) => {
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [selectedChildIds, setSelectedChildIds] = useState([]);

  const [matchingSubscriptions, setMatchingSubscriptions] = useState([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [showSubscriptionSelector, setShowSubscriptionSelector] = useState(false);

  const [showNamingInput, setShowNamingInput] = useState(false);
  const [customName, setCustomName] = useState('');

  const parseJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const onCheckout = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    if (!token) {
      requestLogin('checkout');
      return;
    }
    if (product.type == 'product') {
      const hasMatchingSubscription = Array.isArray(subscriptions) &&
        subscriptions.some(sub =>
          String(sub.product_id) === String(product.id) || String(sub.product_parent_id) === String(product.id)
        );

      // Always show children selector first if product has children
      if (product.children && product.children.length > 0) {
        setShowChildSelector(true);

        if (hasMatchingSubscription) {
          const matching = subscriptions.filter(sub =>
            String(sub.product_id) === String(product.id) || String(sub.product_parent_id) === String(product.id)
          );

          if (matching.length > 0) {
            // ✅ Select only the first for each product_name
            const uniqueByName = Array.from(
              new Map(matching.map(sub => [sub.product_name, sub])).values()
            );

            setMatchingSubscriptions(uniqueByName);
          }
        }
        return;
      }

      // No children, but has subscription match
      if (hasMatchingSubscription) {
        const matching = subscriptions.filter(sub =>
          String(sub.product_id) === String(product.id) || String(sub.product_parent_id) === String(product.id)
        );

        if (matching.length > 0 && !product.end_date) {
          const uniqueByName = Array.from(
            new Map(matching.map(sub => [sub.product_name, sub])).values()
          );

          setMatchingSubscriptions(uniqueByName);
          setShowSubscriptionSelector(true);
          return;
        }
        else {
          const itemsParam = JSON.stringify([product.id]);
          window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&set_name=${product.name}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
          return;
        }
      }


    }
    // No children, no matching subscription
    const itemsParam = JSON.stringify([product.id]);
    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  const onConfirmChildren = () => {
    if (matchingSubscriptions.length > 0) {
      setShowChildSelector(false);
      setShowSubscriptionSelector(true);
      return;
    }

    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    if (selectedChildIds.length === 0) {
      alert('Pilih minimal satu produk');
      return;
    }

    const itemsParam = selectedChildIds.length > 0 ? JSON.stringify(selectedChildIds) : JSON.stringify([product.id]);
    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  const onFinalCheckoutNewProduct = () => {
    if (!customName.trim()) {
      alert('Nama produk tidak boleh kosong');
      return;
    }

    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';
    const itemsParam = selectedChildIds.length > 0 ? JSON.stringify(selectedChildIds) : JSON.stringify([product.id]);
    const encodedName = encodeURIComponent(customName.trim());

    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&new_name=${encodedName}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  const onConfirmSelector = () => {
    if (selectedSubscriptionId == null) {
      alert('Pilih salah satu langganan.');
      return;
    }

    if (selectedSubscriptionId === product.id) {
      setShowNamingInput(true);
    } else {
      const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
      const token = tokenCookie ? tokenCookie.split('=')[1] : '';
      const itemsParam = selectedChildIds.length > 0 ? JSON.stringify(selectedChildIds) : JSON.stringify([product.id]);
      const selectedSubscription = matchingSubscriptions.find(
        (sub) => sub.id === selectedSubscriptionId
      );

      const productName = selectedSubscription?.product_name;
      const encodedName = encodeURIComponent(productName);

      window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&set_name=${encodedName}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
    }
  };

  const priceColor = product.price === 0 ? '#059669' : '#2563eb';

  return (
    <div className={styles.container}>
      {!showChildSelector && !showSubscriptionSelector && !showNamingInput && (
        <>
          <div className={styles.image} style={{ backgroundImage: `url(${product.image})` }}></div>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>{product.name}</h2>
            <div className={styles.price} style={{ color: priceColor }}>
              {product.price == null ? 'Pay-As-You-Go' : `Rp ${parseInt(product.price).toLocaleString('id-ID')}`}
            </div>
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.buttonGroup}>
            {product.end_date && product.site_url && (
              <button
                className={`${styles.button} ${styles.checkoutButton}`}
                onClick={() => {
                  const token = (document.cookie.split('; ').find(row => row.startsWith('token=')) || '').split('=')[1] || '';
                        const url = `${product.site_url}/dashboard/${product.name.toLowerCase().replace(/\s+/g, '_')}?token=${token}`;
                  window.open(url, '_blank');
                }}
              >
                KUNJUNGI
              </button>
            )}

            <button className={`${styles.button} ${styles.checkoutButton}`} onClick={onCheckout}>
              {Array.isArray(subscriptions) &&
                subscriptions.some(sub =>
                  sub.product_id === product.id || sub.product_parent_id === product.id
                ) && product.end_date ? 'Perpanjang' : 'Checkout'}
            </button>

          </div>
        </>
      )}

      {showChildSelector && (
        <div className={styles.childSelector}>
          <h3>Pilih Paket</h3>
          {product.children.map(child => (
            <label key={child.id} className={styles.childProduct}>
              <input
                type="checkbox"
                value={child.id}
                checked={selectedChildIds.includes(child.id)}
                onChange={e => {
                  const checked = e.target.checked;
                  setSelectedChildIds(prev =>
                    checked ? [...prev, child.id] : prev.filter(id => id !== child.id)
                  );
                }}
              />
              &nbsp;{child.name} — Rp {parseInt(child.price || 0).toLocaleString('id-ID')}
            </label>
          ))}
          <p>
            <strong>Total Harga:</strong> Rp {selectedChildIds
              .map(id => product.children.find(child => child.id === id)?.price || 0)
              .reduce((a, b) => a + b, 0)
              .toLocaleString('id-ID')}
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setShowChildSelector(false)}>
              Kembali
            </button>
            <button className={styles.button} onClick={onConfirmChildren}>
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}

      {showSubscriptionSelector && !showNamingInput && (
        <div className={styles.childSelector}>
          <h5>Perpanjang {product.name}</h5>
          {matchingSubscriptions.map(sub => (
            <label key={sub.id} className={styles.childProduct}>
              <input
                type="radio"
                name="subscription"
                value={sub.id}
                checked={selectedSubscriptionId == sub.id}
                onChange={() => { setSelectedSubscriptionId(sub.id); setCustomName(sub.product_name) }}
              />
              &nbsp;{sub.product_name}
            </label>
          ))}
          <h6>Atau buat baru</h6>
          <label className={styles.childProduct}>
            <input
              type="radio"
              name="subscription"
              checked={selectedSubscriptionId === product.id}
              onChange={() => setSelectedSubscriptionId(product.id)}
            />
            &nbsp;Buat {product.name} baru
          </label>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setShowSubscriptionSelector(false)}>
              Kembali
            </button>
            <button className={styles.button} onClick={onConfirmSelector}>
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}

      {showNamingInput && (
        <div className={styles.childSelector}>
          <h5>Buat {product.name} Baru</h5>
          <input
            type="text"
            placeholder="Nama produk..."
            className={styles.input}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '10px' }}
          />

          {
            matchingSubscriptions.some(
              (sub) => sub.product_name === `${product.name}@${customName}`
            ) && (
              <p style={{ color: 'red', marginBottom: '10px' }}>
                Nama produk sudah digunakan.
              </p>
            )
          }

          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={() => {
                setShowNamingInput(false);
                setShowSubscriptionSelector(true);
              }}
            >
              Kembali
            </button>
            <button
              className={styles.button}
              onClick={onFinalCheckoutNewProduct}
              disabled={
                customName.trim() === '' ||
                matchingSubscriptions.some(
                  (sub) => sub.product_name === `${product.name}@${customName}`
                )
              }
            >
              Checkout
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
