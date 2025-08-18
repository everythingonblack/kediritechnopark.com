import React, { useState, useEffect } from 'react';
import styles from './ProductDetail.module.css';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ willDo, setWillDo, subscriptions, product, requestLogin, setShowedModal }) => {
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [selectedChildIds, setSelectedChildIds] = useState([]);

  const [matchingSubscriptions, setMatchingSubscriptions] = useState([]);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(0);
  const [showSubscriptionSelector, setShowSubscriptionSelector] = useState(false);

  const [showNamingInput, setShowNamingInput] = useState(false);
  const [customName, setCustomName] = useState('');

  const navigate = useNavigate();

  const onCheckout = () => {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    if (!token) {
      requestLogin('checkout');
      return;
    }

    if (product.type === 'product') {
      const hasMatchingSubscription = Array.isArray(subscriptions) &&
        subscriptions.some(sub =>
          String(sub.product_id) === String(product.id) || String(sub.product_parent_id) === String(product.id)
        );

      // ✅ Check subscription first
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
        } else {
          const itemsParam = JSON.stringify([product.id]);
          window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&set_name=${product.name}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
          return;
        }
      }

      // ✅ If no subscription → ask for new product name
      setShowNamingInput(true);
      return;
    }

    // Fallback: direct checkout
    const itemsParam = JSON.stringify([product.id]);
    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  // ✅ Confirm child selection (final step after naming)
  const onConfirmChildren = () => {
    if (selectedChildIds.length === 0) {
      alert('Pilih minimal satu produk');
      return;
    }

    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';

    const encodedName = encodeURIComponent(customName.trim() || product.name);
    const itemsParam = JSON.stringify(selectedChildIds);

    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&new_name=${encodedName}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  // ✅ User sets name first → then if product has children, show child selector
  const onFinalCheckoutNewProduct = () => {
    if (!customName.trim()) {
      alert('Nama produk tidak boleh kosong');
      return;
    }

    if (product.children && product.children.length > 0) {
      // don’t redirect yet → go to child selector
        setShowSubscriptionSelector(false);

      setShowNamingInput(false);
      setShowChildSelector(true);
      return;
    }

    // if no children → go straight to checkout
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : '';
    const itemsParam = JSON.stringify([product.id]);
    const encodedName = encodeURIComponent(customName.trim());

    window.location.href = `https://checkout.kediritechnopark.com/?token=${token}&itemsId=${itemsParam}&new_name=${encodedName}&redirect_uri=https://kediritechnopark.com/products&redirect_failed=https://kediritechnopark.com`;
  };

  const onConfirmSelector = () => {
    if (selectedSubscriptionId == null) {
      alert('Pilih salah satu langganan.');
      return;
    }

    if (selectedSubscriptionId === 0) {
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

  useEffect(() => {
    if (willDo === 'checkout') {
      onCheckout();
    }
    if (setWillDo) setWillDo('');
  }, []);

  const priceColor = product.price === 0 ? '#059669' : '#2563eb';

  return (
    <div className={styles.container}>
      {/* Default view */}
      {!showChildSelector && !showSubscriptionSelector && !showNamingInput && (
        <>
          <div className={styles.image} style={{ backgroundImage: `url(${product.image})` }}></div>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>{product.name.split('%%%')[0]}</h2>
            <div className={styles.price} style={{ color: priceColor }}>
              {product.price == null ? 'Pay-As-You-Go' : `Rp ${parseInt(product.price).toLocaleString('id-ID')}`}
            </div>
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.buttonGroup}>
            {(product.site_url || product.end_date || product.quantity) && (
              <button
                className={`${styles.button} ${styles.checkoutButton}`}
                onClick={() => {
                  const token = (document.cookie.split('; ').find(row => row.startsWith('token=')) || '').split('=')[1] || '';
                  const url = product.quantity || product.end_date
                    ? `https://${product.site_url}/dashboard/${product.name.split('%%%')[0]}?token=${token}`
                    : `https://${product.site_url}`;
                  window.location.href = url;
                }}
              >
                {product.end_date || product.quantity ? 'KUNJUNGI SITUS' : 'PELAJARI LEBIH LANJUT'}
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

      {/* Child selector */}
      {showChildSelector && (
        <div className={styles.childSelector}>
          <h3>Pilih Paket</h3>
          {product.children.map(child => (
            <label key={child.id} className={styles.childProduct}>
              <input
                type="radio"
                value={child.id}
                checked={selectedChildIds.includes(child.id)}
                onChange={() => setSelectedChildIds([child.id])}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>&nbsp;{child.name}</div>
                <div>Rp {parseInt(child.price || 0).toLocaleString('id-ID')}</div>
              </div>
            </label>
          ))}
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => { setShowChildSelector(false); setShowNamingInput(true); }}>
              Kembali
            </button>
            <button className={styles.button} onClick={onConfirmChildren}>
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}

      {/* Subscription selector */}
      {showSubscriptionSelector && !showNamingInput && (
        <div className={styles.childSelector}>
          <h5>Kamu sudah punya produk ini</h5>
          <div className={styles.childProduct} onClick={() => { setShowedModal(''); navigate('/dashboard') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Perpanjang produk ini</div>
              <div>➔</div>
            </div>
          </div>
          <h6>Atau</h6>
          <label className={styles.childProduct} onClick={() => { setSelectedSubscriptionId(0); onConfirmSelector(); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>Tambah {product.name.split('%%%')[0]} baru</div>
              <div>➔</div>
            </div>
          </label>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setShowSubscriptionSelector(false)}>
              Kembali
            </button>
          </div>
        </div>
      )}

      {/* Naming input */}
      {showNamingInput && (
        <div className={styles.childSelector}>
          <h5>Buat {product.name.split('%%%')[0]} Baru</h5>
          <input
            type="text"
            placeholder="Nama produk..."
            className={styles.input}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '10px' }}
          />

          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => setShowNamingInput(false)}>
              Kembali
            </button>
            <button
              className={styles.button}
              onClick={onFinalCheckoutNewProduct}
              disabled={customName.trim() === ''}
            >
              Lanjut
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
