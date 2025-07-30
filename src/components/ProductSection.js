import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://bot.kediritechnopark.com/webhook/store-dev/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'product', onlyParents:true }),
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <section id="produk" className="product-section py-5 bg-light">
      <Container>
        <div className="section-heading text-center mb-4">
          <h4>OUR <em>PRODUCT</em></h4>
          <img src="/assets/images/heading-line-dec.png" alt="" />
          <p>Kami menyediakan berbagai solusi teknologi untuk mendukung transformasi digital bisnis dan masyarakat.</p>
        </div>
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="d-flex overflow-auto">
              {products.map((product, idx) => (
                <Card key={idx} className="text-center me-3" style={{ minWidth: '200px' }}>
                  <Card.Img variant="top" src={product.image || '/assets/images/placeholder.png'} alt={product.name} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductSection;
