import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './components/Styles.module.css';

import Login from './components/Login';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProductSection from './components/ProductSection';
import AcademySection from './components/AcademySection';
import AboutUsSection from './components/AboutUsSection';
import KnowledgeBaseSection from './components/KnowledgeBaseSection';
import ClientsSection from './components/ClientsSection';
import Footer from './components/Footer';
import ProductDetailPage from './components/ProductDetailPage';
import Dashboard from './components/Dashboard';
import CreateProductPage from './components/CreateProductPage';
import ProductsPage from './components/pages/ProductsPage';

import processProducts from './helper/processProducts';

function HomePage({
  hoveredCard,
  setHoveredCard,
  selectedProduct,
  setSelectedProduct,
  showedModal,
  setShowedModal,
  productSectionRef,
  courseSectionRef
}) {
  return (
    <>
      <HeroSection />

      <AboutUsSection />
      <ServicesSection />
      <ProductSection
        productSectionRef={productSectionRef}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        setSelectedProduct={setSelectedProduct}
        setShowedModal={setShowedModal}
      />
      <AcademySection
        courseSectionRef={courseSectionRef}
        hoveredCard={hoveredCard}
        setHoveredCard={setHoveredCard}
        setSelectedProduct={setSelectedProduct}
        setShowedModal={setShowedModal}
      />
      <KnowledgeBaseSection />
      <ClientsSection />
    </>
  );
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showedModal, setShowedModal] = useState(null);
  const [subProductOf, setSubProductOf] = useState(null);
  const [username, setUsername] = useState(null);

  const productSectionRef = useRef(null);
  const courseSectionRef = useRef(null);

  const [productModalRequest, setProductModalRequest] = useState(null);


  const scrollToProduct = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCourse = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const requestLogin = (nextAction) => {
    const url = new URL(window.location);
    url.searchParams.set('next', nextAction);
    window.history.pushState({}, '', url);
    setShowedModal('login');
  };

  // Ambil token dan user info dari cookie
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
      const token = match[2];
      fetch('https://bot.kediritechnopark.com/webhook/user-production/data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.token) {
            document.cookie = `token=${data.token}; path=/`;
            setSubscriptions(data.subscriptions);
            const payload = parseJwt(data.token);
            if (payload && payload.username) {
              setUsername(payload.username);
            }
          }
        })
        .catch(err => {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
          setUsername(null);
          window.location.reload();
        });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalType = params.get('modal');
    const productId = params.get('product_id');
    const authorizedUri = params.get('authorized_uri');
    const unauthorizedUri = params.get('unauthorized_uri');

    if (modalType === 'product' && productId) {
      const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];

      // Simpan semua param penting ke localStorage
      localStorage.setItem('product_id', productId);
      if (authorizedUri) localStorage.setItem('authorized_uri', authorizedUri);
      if (unauthorizedUri) localStorage.setItem('unauthorized_uri', unauthorizedUri);

      // Jika belum login, tampilkan modal login
      if (!token) {
        setShowedModal('login');
      }
      // Jika sudah login, tidak langsung fetch di sini — akan diproses saat subscriptions tersedia
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalType = params.get('modal');
    const productId = parseInt(params.get('product_id'));
    const authorizedUri = params.get('authorized_uri');
    const unauthorizedUri = params.get('unauthorized_uri');

    const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];

    if (modalType === 'product' && productId) {
      if (!token) {
        setShowedModal('login'); // belum login → tampilkan login modal
      } else {
        // sudah login → lanjutkan proses otorisasi saat subscriptions tersedia
        setProductModalRequest({ productId, authorizedUri, unauthorizedUri });
        console.log('modal')
      }
    }
  }, []);

  useEffect(() => {
    console.log(subscriptions)
    if (!productModalRequest || !subscriptions) return;

    const { productId, authorizedUri, unauthorizedUri } = productModalRequest;
    console.log(subscriptions)
    const hasAccess = subscriptions && subscriptions.some(
      sub => sub.product_id === productId || sub.product_parent_id === productId
    );
    console.log(hasAccess)
    if (hasAccess) {
      if (authorizedUri) {
        let finalUri = decodeURIComponent(authorizedUri);
        const token = document.cookie.match(/(^| )token=([^;]+)/)?.[2];

        if (finalUri.includes('token=null') || finalUri.includes('token=')) {
          const url = new URL(finalUri);
          url.searchParams.set('token', token || '');
          finalUri = url.toString();
        }

        window.location.href = finalUri;
      }
      else {// Assuming you already imported processProducts from './processProducts'

        fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemsId: [productId],
            withChildren: true,
          }),
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              // Process the raw data to group children under their parent
              const processed = processProducts(data);
              // Set the first product (which should be the parent with children nested)
              setSelectedProduct(processed[0]);
              setShowedModal('product');
            }
          })
          .catch(err => console.error('Fetch product error:', err));
      }
    } else {
      if (unauthorizedUri) {
        window.location.href = decodeURIComponent(unauthorizedUri);
      } else {

        fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemsId: [productId],
            withChildren: true,
          }),
        })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              // Process the raw data to group children under their parent
              const processed = processProducts(data);
              // Set the first product (which should be the parent with children nested)
              setSelectedProduct(processed[0]);
              setShowedModal('product');
            }
          })
          .catch(err => console.error('Fetch product error:', err));

        console.log('modal')
      }
    }

    setProductModalRequest(null); // reset
  }, [subscriptions, productModalRequest]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    setUsername(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div id="js-preloader" className="js-preloader">
        <div className="preloader-inner">
          <span className="dot"></span>
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header
          username={username}
          scrollToProduct={scrollToProduct}
          scrollToCourse={scrollToCourse}
          setShowedModal={setShowedModal}
          handleLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                showedModal={showedModal}
                setShowedModal={setShowedModal}
                productSectionRef={productSectionRef}
                courseSectionRef={courseSectionRef}
              />
            }
          />
          <Route path="/products" element={<ProductsPage subscriptions={subscriptions} />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                setShowedModal={(e, productId) => {
                  setShowedModal(e);
                  setSubProductOf(productId);
                }}
              />
            }
          />
        </Routes>
        <Footer />

        {/* Modal */}
        {showedModal && (
          <div
            className={styles.modal}
            onClick={() => {
              const url = new URL(window.location);
              url.searchParams.delete('modal');
              url.searchParams.delete('product_id');
              url.searchParams.delete('authorized_uri');
              url.searchParams.delete('unauthorized_uri');
              url.searchParams.delete('next');
              window.history.pushState({}, '', url);
              setShowedModal(null);
              setSelectedProduct({});
            }}
          >
            <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
              {showedModal === 'product' && (
                <ProductDetailPage
                  subscriptions={subscriptions}
                  requestLogin={requestLogin}
                  product={selectedProduct}
                  setShowedModal={setShowedModal}
                />
              )}
              {showedModal === 'create-item' && (
                <CreateProductPage
                  parentId={subProductOf}
                  subscriptions={subscriptions}
                  requestLogin={requestLogin}
                  product={selectedProduct}
                  setShowedModal={setShowedModal}
                />
              )}
              {showedModal === 'login' && (
                <Login setShowedModal={setShowedModal} />
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
