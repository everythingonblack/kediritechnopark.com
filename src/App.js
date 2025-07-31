import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './components/Styles.module.css';

// Import components
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

import ProductsPage from './components/pages/ProductsPage';



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
        setShowedModal={setShowedModal} />
      <AboutUsSection />
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

  // State yang diperlukan untuk HomePage
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showedModal, setShowedModal] = useState(null); // 'product' | 'login' | null
  const [postLoginAction, setPostLoginAction] = useState(null);
  
  const [username, setUsername] = useState(null);

  const productSectionRef = useRef(null);
  const courseSectionRef = useRef(null);

    useEffect(() => {
        // Ambil token dari cookies
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        if (match) {
            const token = match[2];

            fetch('https://bot.kediritechnopark.com/webhook/user-dev/data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token

                },
            })
                .then(res => res.json())
                .then(data => {

                    if (data && data[0] && data[0].token) {
                        // Update token with data[0].token
                        document.cookie = `token=${data[0].token}; path=/`;
                    } else {
                        console.warn('Token tidak ditemukan dalam data.');
                    }
                })
                .catch(err => console.error('Fetch error:', err));

            const payload = parseJwt(token);
            if (payload && payload.username) {
                setUsername(payload.username);
            }
        }
    }, []);
  const scrollToProduct = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToCourse = () => {
    courseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
        <Header username={username} scrollToProduct={scrollToProduct} scrollToCourse={scrollToCourse} setShowedModal={setShowedModal} />
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
          <Route
            path="/"
            element={
              <ProductsPage/>
            }
          />
        </Routes>
        <Footer />
          {/* Unified Modal */}
            {showedModal && (
                <div
                    className={styles.modal}
                    onClick={() => {
                        setShowedModal(null);
                        setSelectedProduct({});
                    }}
                >
                    <div
                        className={styles.modalBody}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showedModal === 'product' && (
                            <ProductDetailPage
                                setPostLoginAction={setPostLoginAction}
                                setShowedModal={setShowedModal}
                                product={selectedProduct}
                                onClose={() => {
                                    setShowedModal(null);
                                    setSelectedProduct({});
                                }}
                            />
                        )}
                        {showedModal === 'login' && (
                            <Login postLoginAction={postLoginAction} setPostLoginAction={setPostLoginAction} onClose={() => setShowedModal(null)} />
                        )}
                    </div>
                </div>
            )}
      </div>
    </Router>
  );
}

export default App;
