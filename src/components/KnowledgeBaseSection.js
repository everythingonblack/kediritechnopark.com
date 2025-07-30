import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const KnowledgeBaseSection = () => {
  return (
    <section id="knowledge" className="knowledge section py-5">
      <Container>
        <Row>
          <Col lg={{ span: 8, offset: 2 }}>
            <div className="section-heading text-center mb-4">
              <h4>KNOWLEDGE <em>BASE</em></h4>
              <img src="/assets/images/heading-line-dec.png" alt="" className="mb-3" />
              <p>Berbagai artikel dan panduan untuk membantu Anda memahami teknologi dan inovasi digital.</p>
            </div>
            <div className="knowledge-content">
              <p>Kami sedang mengembangkan pusat dokumentasi digital, artikel praktis, dan tutorial untuk mendukung pelaku usaha dan masyarakat digital. Nantikan konten terbaru kami!</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default KnowledgeBaseSection;