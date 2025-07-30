import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AcademySection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://bot.kediritechnopark.com/webhook/store-dev/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'course' }),
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <section id="academy" className="academy-tables py-5">
      <Container>
        <div className="section-heading text-center mb-4">
          <h4>OUR <em>ACADEMY PROGRAM</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Academy Program adalah wadah belajar digital untuk anak-anak dan remaja. Didesain interaktif, kreatif, dan gratis — setiap modul membekali peserta dengan keterampilan masa depan, dari teknologi dasar hingga coding dan proyek nyata.</p>
        </div>
        <Row>
          {products.map((product, idx) => (
            <Col lg={3} md={4} sm={6} xs={12} key={idx} className="mb-4">
              <Card className="academy-item-regular h-100">
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <div className="icon mb-3">
                    <img src={product.image || '/assets/images/pricing-table-01.png'} alt={product.name} className="img-fluid" />
                  </div>
                  <ul>
                    {product.duration && (
                      <li>
                        Durasi:{" "}
                        {product.duration.hours
                          ? `${product.duration.hours} jam`
                          : product.duration.days
                          ? `${product.duration.days} hari`
                          : "-"}
                      </li>
                    )}
                    <li>Harga: {product.currency} {product.price.toLocaleString()}</li>
                  </ul>
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
