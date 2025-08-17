import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './FAQSection.module.css';

const Accordion = ({ children, type = "single", collapsible = true, className = "" }) => {
  return (
    <div className={`${styles.accordion} ${className}`}>
      {children}
    </div>
  );
};

const AccordionItem = ({ children, value, className = "" }) => {
  return (
    <div className={`${styles.accordionItem} ${className}`} data-value={value}>
      {children}
    </div>
  );
};

const AccordionTrigger = ({ children, className = "", onClick, isExpanded }) => {
  return (
    <button
      className={`${styles.accordionTrigger} ${className} ${isExpanded ? styles.expanded : ''}`}
      onClick={onClick}
      aria-expanded={isExpanded}
    >
      <span className={styles.triggerText}>{children}</span>
      <svg 
        className={`${styles.chevron} ${isExpanded ? styles.rotated : ''}`} 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none"
      >
        <path 
          d="M4 6L8 10L12 6" 
          stroke={isExpanded ? "#0057b8" : "currentColor"} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const AccordionContent = ({ children, className = "", isExpanded }) => {
  return (
    <div 
      className={`${styles.accordionContent} ${className} ${isExpanded ? styles.expanded : ''}`}
      style={{
        maxHeight: isExpanded ? '500px' : '0',
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <div className={styles.contentInner}>
        {children}
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeItem, setActiveItem] = useState("item-1");

  const handleToggle = (value) => {
    if (activeItem === value) {
      setActiveItem("");
    } else {
      setActiveItem(value);
    }
  };

  const faqs = [
    {
      id: "item-1",
      question: "Apa itu Kediri Technopark?",
      answer: "Kediri Technopark adalah pusat pengembangan inovasi digital dan aplikasi untuk masyarakat dan pelaku usaha di Kediri. Kami menyediakan berbagai solusi teknologi untuk membantu bisnis berkembang di era digital."
    },
    {
      id: "item-2",
      question: "Produk apa saja yang ditawarkan oleh Kediri Technopark?",
      answer: "Kami menawarkan berbagai produk digital seperti platform Point of Sale (Kedai Master), aplikasi manajemen bisnis, solusi e-commerce, serta layanan pengembangan website dan aplikasi custom sesuai kebutuhan bisnis Anda."
    },
    {
      id: "item-3",
      question: "Apakah ada program akademi untuk belajar teknologi?",
      answer: "Ya, kami memiliki Academy Program yang dirancang untuk anak-anak dan remaja. Program ini mencakup berbagai bidang seperti pemrograman, robotika, desain grafis, pengembangan web, dan data science dengan pendekatan yang interaktif dan kreatif."
    },
    {
      id: "item-4",
      question: "Bagaimana cara mendaftar program akademi?",
      answer: "Anda dapat mendaftar melalui website kami dengan mengklik tombol 'Daftar' pada program yang diminati. Setelah itu, tim kami akan menghubungi Anda untuk proses selanjutnya. Beberapa program bahkan tersedia secara gratis."
    },
    {
      id: "item-5",
      question: "Apakah ada biaya untuk menggunakan produk Kediri Technopark?",
      answer: "Kami menawarkan berbagai paket dengan harga yang berbeda sesuai dengan kebutuhan bisnis Anda. Beberapa produk memiliki versi gratis dengan fitur dasar, dan paket berbayar dengan fitur yang lebih lengkap. Anda dapat melihat detail harga di halaman produk masing-masing."
    },
    {
      id: "item-6",
      question: "Berapa lama waktu implementasi produk Kediri Technopark?",
      answer: "Waktu implementasi tergantung pada kompleksitas kebutuhan bisnis Anda. Untuk produk standar seperti Kedai Master, implementasi bisa dilakukan dalam 1-3 hari kerja. Untuk solusi custom, waktu implementasi akan disesuaikan dengan kebutuhan spesifik Anda."
    },
    {
      id: "item-7",
      question: "Apakah tersedia pelatihan penggunaan produk?",
      answer: "Ya, kami menyediakan pelatihan gratis untuk penggunaan produk standar kami. Untuk paket berbayar, pelatihan akan disesuaikan dengan paket yang Anda pilih. Tim support kami juga selalu siap membantu jika Anda memiliki pertanyaan."
    },
    {
      id: "item-8",
      question: "Bagaimana jika saya memiliki pertanyaan teknis?",
      answer: "Anda dapat menghubungi tim support kami melalui email marketing@kediritechnopark.com atau melalui nomor WhatsApp 0813 1889 4994. Tim kami akan dengan senang hati membantu menjawab pertanyaan teknis Anda."
    }
  ];

  return (
    <section id="faq" className={styles.faqSection}>
      <Container>
        <Row>
          <Col>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>
                FREQUENTLY ASKED <span className={styles.highlight}>QUESTIONS</span>
              </h2>
              <p className={styles.sectionDescription}>
                Temukan jawaban untuk pertanyaan umum tentang layanan dan produk kami
              </p>
            </div>
            
            <Accordion type="single" collapsible className={styles.accordionRoot}>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className={styles.accordionItemShadcn}>
                  <AccordionTrigger 
                    isExpanded={activeItem === faq.id}
                    onClick={() => handleToggle(faq.id)}
                    className={styles.accordionTriggerShadcn}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent 
                    isExpanded={activeItem === faq.id}
                    className={styles.accordionContentShadcn}
                  >
                    <div className={styles.answer}>
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQSection;