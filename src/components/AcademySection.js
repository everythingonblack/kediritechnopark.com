import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AcademySection = () => {
  return (
    <section id="academy" className="academy-tables py-5">
      <Container>
        <div className="section-heading text-center mb-4">
          <h4>OUR <em>ACADEMY PROGRAM</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Academy Program adalah wadah belajar digital untuk anak-anak dan remaja. Didesain interaktif, kreatif, dan gratis — setiap modul membekali peserta dengan keterampilan masa depan, dari teknologi dasar hingga coding dan proyek nyata.</p>
        </div>
        <Row>
          {[
            { title: 'Digital Funstart', items: ['Pengenalan teknologi', 'Interaktif & menyenangkan', 'Untuk anak-anak usia dini'] },
            { title: 'KidCode', items: ['Belajar coding visual', 'Kreatif & edukatif', 'Untuk anak SD & SMP'] },
            { title: 'Tech for Teens', items: ['Pengembangan skill digital', 'Remaja & pelajar', 'Berbasis proyek'] },
            { title: 'IT Training Camp', items: ['Pelatihan intensif IT', 'Untuk semua usia', 'Instruktur profesional'] },
            { title: 'Smart Teacher', items: ['Pelatihan guru', 'Integrasi teknologi', 'Media ajar digital'] },
            { title: 'Smart Staff', items: ['Pelatihan digital untuk staf', 'Administrasi dan operasional', 'Penguatan sistem kerja'] },
            { title: 'UMKM Go Digital', items: ['Digitalisasi bisnis kecil', 'Platform online', 'Pelatihan marketplace'] },
            { title: 'Creative Spark', items: ['Inkubasi ide kreatif', 'Coaching & mentoring', 'Kompetisi & showcase'] },
          ].map((program, idx) => (
            <Col lg={3} key={idx} className="mb-4">
              <Card className="academy-item-regular h-100">
                <Card.Body>
                  <Card.Title>{program.title}</Card.Title>
                  <div className="icon mb-3">
                    <img src="/assets/images/pricing-table-01.png" alt="" />
                  </div>
                  <ul>
                    {program.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}</ul>
                  <div className="border-button mt-3">
                    <Button variant="outline-primary" href="#program">Lihat Detail</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AcademySection;