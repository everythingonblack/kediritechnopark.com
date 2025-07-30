import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './assets/css/templatemo-chain-app-dev.css'; // Assuming you copy your original CSS here
// import './assets/css/animated.css';
// import './assets/css/owl.css';

// Import your converted React components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProductSection from './components/ProductSection';
import AcademySection from './components/AcademySection';
import AboutUsSection from './components/AboutUsSection';
import KnowledgeBaseSection from './components/KnowledgeBaseSection';
import ClientsSection from './components/ClientsSection';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate preloader and remove it after some time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust time as needed
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
    <div className="App">
      <Header />
      <HeroSection />
      {/* FULL WIDTH IMAGE SECTION */}
      {/* This can be a separate component or integrated into HeroSection */}
      <div className="custom-image-section wow fadeInRight">
        <a href="https://registration.kediritechnopark.com/" target="_blank" className="custom-image-link" rel="noopener noreferrer">
          <div className="custom-image-wrapper">
            <img src="/assets/images/FREE!.png" alt="Snack dan Jajanan" className="custom-image" />
            <div className="light-glare"></div>
          </div>
        </a>
      </div>

      <ServicesSection />
      <ProductSection />
      <AcademySection />
      <AboutUsSection />
      <KnowledgeBaseSection />
      <ClientsSection />
      <Footer />
    </div>
  );
}

export default App;