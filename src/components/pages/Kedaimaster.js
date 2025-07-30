import React from 'react';

const KedaiMasterLanding = () => {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%)',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c3e50'
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    navLink: {
      textDecoration: 'none',
      color: '#2c3e50',
      fontSize: '0.9rem',
      transition: 'color 0.3s'
    },
    ctaButton: {
      backgroundColor: '#4a90e2',
      color: 'white',
      padding: '0.5rem 1.5rem',
      border: 'none',
      borderRadius: '25px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'transform 0.3s'
    },
    hero: {
      display: 'flex',
      alignItems: 'center',
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heroContent: {
      flex: 1,
      paddingRight: '2rem'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '1rem',
      lineHeight: '1.2'
    },
    heroText: {
      fontSize: '1.1rem',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '2rem'
    },
    heroImage: {
      flex: 1,
      textAlign: 'center'
    },
    coffeeIcon: {
      fontSize: '8rem',
      background: 'linear-gradient(45deg, #ffa726, #ff9800)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      padding: '2rem',
      borderRadius: '20px',
      backgroundColor: 'rgba(255, 167, 38, 0.1)'
    },
    features: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    featuresTitle: {
      textAlign: 'center',
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '3rem'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '4rem'
    },
    featureCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      padding: '2rem',
      borderRadius: '15px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'transform 0.3s'
    },
    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    featureText: {
      color: '#666',
      lineHeight: '1.5'
    },
    appShowcase: {
      display: 'flex',
      alignItems: 'center',
      gap: '3rem',
      marginTop: '4rem'
    },
    appContent: {
      flex: 1
    },
    appTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    appText: {
      color: '#666',
      lineHeight: '1.6'
    },
    appImages: {
      flex: 1,
      position: 'relative',
      height: '300px'
    },
    phoneScreen: {
      width: '200px',
      height: '350px',
      backgroundColor: 'white',
      borderRadius: '25px',
      padding: '1rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    phoneScreen1: {
      left: '0',
      top: '0',
      zIndex: 2
    },
    phoneScreen2: {
      right: '0',
      top: '50px',
      zIndex: 1
    },
    screenHeader: {
      height: '40px',
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      marginBottom: '0.5rem'
    },
    screenContent: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      borderRadius: '10px',
      padding: '0.5rem'
    },
    cta: {
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    ctaTitle: {
      fontSize: '2rem',
      color: '#2c3e50',
      marginBottom: '2rem'
    },
    ctaButtonLarge: {
      backgroundColor: '#8b4513',
      color: 'white',
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: '30px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'transform 0.3s'
    },
    pricing: {
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
      textAlign: 'center'
    },
    pricingTitle: {
      fontSize: '2.5rem',
      color: 'white',
      marginBottom: '3rem'
    },
    pricingCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    pricingCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '2rem',
      borderRadius: '15px',
      position: 'relative'
    },
    pricingBadge: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem'
    },
    pricingPlan: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    pricingPrice: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#4caf50',
      marginBottom: '1.5rem'
    },
    pricingFeatures: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '2rem'
    },
    pricingFeature: {
      padding: '0.5rem 0',
      color: '#666',
      borderBottom: '1px solid #eee'
    },
    pricingButton: {
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '0.8rem 2rem',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1rem'
    },
    footer: {
      background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
      color: 'white',
      padding: '4rem 2rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    },
    footerWave: {
      position: 'absolute',
      top: '-50px',
      left: 0,
      width: '100%',
      height: '100px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50% 50% 0 0'
    },
    footerContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '3rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    footerSection: {
      textAlign: 'left'
    },
    footerTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem'
    },
    footerText: {
      lineHeight: '1.6',
      opacity: 0.9
    },
    copyright: {
      textAlign: 'center',
      marginTop: '2rem',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      opacity: 0.7
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>🏪</span>
          <span>TECHNORAMA</span>
        </div>
        <nav>
          <ul style={styles.nav}>
            <li><a href="#" style={styles.navLink}>Home</a></li>
            <li><a href="#" style={styles.navLink}>Services</a></li>
            <li><a href="#" style={styles.navLink}>Product</a></li>
            <li><a href="#" style={styles.navLink}>Academy</a></li>
            <li><a href="#" style={styles.navLink}>About</a></li>
            <li><a href="#" style={styles.navLink}>Contact</a></li>
          </ul>
        </nav>
        <button style={styles.ctaButton}>Sign Up Now</button>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Kedai Master</h1>
          <p style={styles.heroText}>
            Platform Point of Sale terdepan yang dirancang khusus untuk meningkatkan
            kepuasan operational kafe dan restoran milik KM. Dengan sistem yang fleksibel,
            terpercaya, dan efisien.
          </p>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.coffeeIcon}>☕</div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Fitur Unggulan</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Manajemen Tenant & Kasir</h3>
            <p style={styles.featureText}>
              Sistem untuk mengatur dan mengoptimalkan kinerja seluruh tenant.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>QR Pemesanan di Meja</h3>
            <p style={styles.featureText}>
              Tamu restoran langsung dan mengoptimalkan waktu pemesanan dan pelayanan.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Otomatisasi Pesanan & Keuangan</h3>
            <p style={styles.featureText}>
              Mengatur operasional anda dengan otomatisasi pesanan dan keuangan.
            </p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Request & Voting Lagu</h3>
            <p style={styles.featureText}>
              Tamu dapat meminta lagu untuk diputar di restoran dan memberikan suasana.
            </p>
          </div>
        </div>

        {/* App Showcase */}
        <div style={styles.appShowcase}>
          <div style={styles.appContent}>
            <h3 style={styles.appTitle}>
              Gak perlu repot anti jam kerja yang baik bozen lagi. 
              Tinggal scan QR yang ada di meja, langsung bisa udah langsung workflow
            </h3>
            <p style={styles.appText}>
              © 2025 KEDAIMASTERPBM.COM
            </p>
          </div>
          <div style={styles.appImages}>
            <div style={{...styles.phoneScreen, ...styles.phoneScreen1}}>
              <div style={styles.screenHeader}></div>
              <div style={styles.screenContent}></div>
            </div>
            <div style={{...styles.phoneScreen, ...styles.phoneScreen2}}>
              <div style={styles.screenHeader}></div>
              <div style={styles.screenContent}></div>
            </div>
          </div>
        </div>

        <div style={{...styles.appShowcase, flexDirection: 'row-reverse', marginTop: '4rem'}}>
          <div style={styles.appContent}>
            <h3 style={styles.appTitle}>Desain Menu Modern</h3>
            <p style={styles.appText}>
              Tampilan menu yang familiar, menarik dan mudah dipahami sehingga customer bisa dengan mudah memahami visual yang menarik untuk pengalaman ordering yang maksimal untuk kafe dan restoran masa kini.
            </p>
          </div>
          <div style={styles.appImages}>
            <div style={{...styles.phoneScreen, ...styles.phoneScreen1}}>
              <div style={styles.screenHeader}></div>
              <div style={styles.screenContent}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Siap Tingkatkan Bisnis Anda?</h2>
        <button style={styles.ctaButtonLarge}>Coba Kedai Master Sekarang</button>
      </section>

      {/* Pricing Section */}
      <section style={styles.pricing}>
        <h2 style={styles.pricingTitle}>OUR PACK KEDAI MASTER</h2>
        <div style={styles.pricingCards}>
          <div style={styles.pricingCard}>
            <div style={styles.pricingBadge}>PAKET BASIC</div>
            <h3 style={styles.pricingPlan}>Starter Pack</h3>
            <div style={styles.pricingPrice}>Rp 245.000</div>
            <ul style={styles.pricingFeatures}>
              <li style={styles.pricingFeature}>1 user untuk admin</li>
              <li style={styles.pricingFeature}>Support via email</li>
            </ul>
            <button style={styles.pricingButton}>Pilih Paket</button>
          </div>
          
          <div style={styles.pricingCard}>
            <div style={styles.pricingBadge}>PAKET SILVER</div>
            <h3 style={styles.pricingPlan}>Business Pack</h3>
            <div style={styles.pricingPrice}>Rp 499.000</div>
            <ul style={styles.pricingFeatures}>
              <li style={styles.pricingFeature}>Integrasi Meja & Jemput</li>
              <li style={styles.pricingFeature}>All permission & control</li>
              <li style={styles.pricingFeature}>Unlimited locations for pemasangan</li>
            </ul>
            <button style={styles.pricingButton}>Pilih Paket</button>
          </div>
          
          <div style={styles.pricingCard}>
            <div style={styles.pricingBadge}>PAKET GOLD</div>
            <h3 style={styles.pricingPlan}>Enterprise Pack</h3>
            <div style={styles.pricingPrice}>Rp 849.000</div>
            <ul style={styles.pricingFeatures}>
              <li style={styles.pricingFeature}>All benefits unlimited fitures &</li>
              <li style={styles.pricingFeature}>Multi outlet & multi users</li>
              <li style={styles.pricingFeature}>Integrasi fitur locations</li>
            </ul>
            <button style={styles.pricingButton}>Pilih Paket</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerWave}></div>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Contact Us</h3>
            <p style={styles.footerText}>
              Jalan ABC No. 123, Kota Surabaya, Jawa Timur 60123<br/>
              Phone: +62 123 456 7890<br/>
              Email: info@kedaimaster.com<br/>
              Website: www.kedaimaster.com
            </p>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>About Our Company</h3>
            <div style={styles.logo}>
              <span>🏪</span>
              <span>TECHNORAMA</span>
            </div>
            <p style={styles.footerText}>
              Kami adalah perusahaan yang berfokus pada solusi teknologi untuk industri F&B.
              Dengan pengalaman bertahun-tahun, kami berkomitmen memberikan layanan terbaik.
            </p>
          </div>
        </div>
        <div style={styles.copyright}>
          <p>© 2025 Kedai Master by Technorama. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default KedaiMasterLanding;