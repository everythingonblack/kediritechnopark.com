import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Tabs, Tab, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = ({
  subscriptions,
  setSelectedProduct,
  setShowedModal,
  userData,
  setWillDo
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [settings, setSettings] = useState({
    username: "",
    email: "",
    password: "",
    profile_data: {
      name: "",
      image: "",
      phone: "",
      address: "",
      company: ""
    }
  });

  // 🔹 Handle input settings
  const handleSettingsChange = (field, value, nested = false) => {
    if (nested) {
      setSettings((prev) => ({
        ...prev,
        profile_data: { ...prev.profile_data, [field]: value }
      }));
    } else {
      setSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  // 🔹 Save profile
  const saveSettings = () => {
    fetch("https://bot.kediritechnopark.com/webhook-test/user-production/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    })
      .then((res) => res.json())
      .then(() => alert("Settings updated successfully!"))
      .catch((err) => alert("Error updating settings: " + err));
  };

  // 🔹 Group subscriptions
  const groupSubscriptionsByProductName = (subs) => {
    const result = {};
    subs.forEach((sub) => {
      const name = sub.product_name;
      const productId = sub.product_id;
      if (!result[name]) {
        result[name] = {
          product_id: productId,
          product_name: name,
          unit_type: sub.unit_type,
          end_date: sub.end_date,
          quantity: 0,
          subscriptions: []
        };
      }
      const currentEnd = new Date(result[name].end_date);
      const thisEnd = new Date(sub.end_date);
      if (thisEnd > currentEnd) result[name].end_date = sub.end_date;

      if (sub.unit_type === "token") {
        result[name].quantity += sub.quantity ?? 0;
      } else {
        result[name].quantity += 1;
      }
      result[name].subscriptions.push(sub);
    });
    return result;
  };

  // 🔹 Fetch produk berdasarkan subscription
  useEffect(() => {
    if (!subscriptions) return;

    const groupedSubs = groupSubscriptionsByProductName(subscriptions);
    const productIds = [...new Set(subscriptions.map((s) => s.product_id))];

    fetch("https://bot.kediritechnopark.com/webhook/store-production/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemsId: productIds })
    })
      .then((res) => res.json())
      .then((data) => {
        const enrichedData = Object.values(groupedSubs)
          .filter((group) => data.some((p) => p.id === group.product_id))
          .map((group) => {
            const productData = data.find((p) => p.id === group.product_id);
            let image = productData?.image || "";
            let description = productData?.description || "";
            let site_url = productData?.site_url || "";
            if (!image && productData?.sub_product_of) {
              const parent = data.find((p) => p.id === productData.sub_product_of);
              image = parent?.image || "";
              description = parent?.description || "";
              site_url = parent?.site_url || "";
            }
            return {
              executeCheckout: group.product_name,
              id: group.product_id,
              name: group.product_name,
              type: productData?.type || "product",
              image,
              description,
              site_url,
              price: productData?.price || 0,
              currency: productData?.currency || "IDR",
              duration: productData?.duration || {},
              sub_product_of: productData?.sub_product_of || null,
              is_visible: productData?.is_visible ?? true,
              unit_type: productData?.unit_type || group.unit_type,
              quantity: group.quantity,
              end_date: group.end_date,
              children: []
            };
          });

        setProducts(enrichedData);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [subscriptions]);

  return (
    <Container fluid className="mt-4">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        {/* Produk Saya */}
        <Tab eventKey="products" title="Produk Saya">
          <Row>
            {products.map((product) => (
              <Col md={4} key={product.id} className="mb-4">
                <Card
                  className={`h-100 shadow-sm ${hoveredCard === product.name ? "border-primary" : ""}`}
                  onMouseEnter={() => setHoveredCard(product.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowedModal("product");
                  }}
                >
                  {product.image && (
                    <Card.Img variant="top" src={product.image} />
                  )}
                  <Card.Body>
                    <Card.Title>{product.name.split("%%%")[0]}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      {product.unit_type === "duration"
                        ? `Valid until: ${
                            product.end_date
                              ? new Date(product.end_date).toLocaleDateString()
                              : "N/A"
                          }`
                        : `SISA TOKEN ${product.quantity || 0}`}
                    </small>
                    <Button
                      variant="primary"
                      size="sm"
                      className="float-end"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowedModal("product");
                        setWillDo("checkout");
                      }}
                    >
                      Perpanjang
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}

            {/* Tambah produk baru */}
            <Col md={4} className="mb-4">
              <Card
                className={`h-100 shadow-sm text-center align-items-center justify-content-center`}
                onClick={() => navigate("/?tab=products")}
              >
                <Card.Body>
                  <h5>+ Tambah produk baru</h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Profil Pengguna */}
        <Tab eventKey="settings" title="Profil Pengguna">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={settings.username}
                    onChange={(e) =>
                      handleSettingsChange("username", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={settings.email}
                    onChange={(e) =>
                      handleSettingsChange("email", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={settings.profile_data.name}
                    onChange={(e) =>
                      handleSettingsChange("name", e.target.value, true)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={settings.profile_data.phone}
                    onChange={(e) =>
                      handleSettingsChange("phone", e.target.value, true)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={settings.profile_data.address}
                onChange={(e) =>
                  handleSettingsChange("address", e.target.value, true)
                }
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    value={settings.profile_data.company}
                    onChange={(e) =>
                      handleSettingsChange("company", e.target.value, true)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image URL</Form.Label>
                  <Form.Control
                    value={settings.profile_data.image}
                    onChange={(e) =>
                      handleSettingsChange("image", e.target.value, true)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={settings.password}
                    onChange={(e) =>
                      handleSettingsChange("password", e.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Re-type New Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="success" onClick={saveSettings}>
              Save Changes
            </Button>
          </Form>
        </Tab>

        {/* Orders */}
        <Tab eventKey="orders" title="Pembelian">
          <h4>My Orders</h4>
          <p>Orders list will be displayed here.</p>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Dashboard;
