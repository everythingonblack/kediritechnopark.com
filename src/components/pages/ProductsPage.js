import React, { useState, useEffect } from "react";
import styles from "../Styles.module.css";
import { Box, Settings, ShoppingCart } from "lucide-react";
import { useNavigate } from 'react-router-dom';


const Dashboard = ({
  subscriptions,
  setSelectedProduct,
  setShowedModal,
  userData,
  setWillDo
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);

  // User Settings form state
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

  useEffect(() => {
    if (userData) {
      setSettings(userData);
    }
  }, [userData]);

  useEffect(() => {
    if (!subscriptions) return;

    function groupSubscriptionsByProductName(subs) {
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
        if (thisEnd > currentEnd) {
          result[name].end_date = sub.end_date;
        }

        if (sub.unit_type === "token") {
          result[name].quantity += sub.quantity ?? 0;
        } else {
          result[name].quantity += 1;
        }

        result[name].subscriptions.push(sub);
      });

      return result;
    }

    const groupedSubs = groupSubscriptionsByProductName(subscriptions);
    const productIds = [...new Set(subscriptions.map((s) => s.product_id))];

    fetch(
      "https://bot.kediritechnopark.com/webhook/store-production/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ itemsId: productIds})
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // Step 1: Enrich base products (without children yet)
        const enrichedData = Object.values(groupedSubs)
          .filter((group) => data.some((p) => p.id === group.product_id))
          .map((group) => {
            const productData = data.find((p) => p.id == group.product_id);
            let image = productData?.image || "";
            let description = productData?.description || "";
            let site_url = productData?.site_url || "";
            if (!image && productData?.sub_product_of) {
              const parent = data.find(
                (p) => p.id === productData.sub_product_of
              );
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

        // Step 2: Create a quick lookup table for enrichedData
        const productMap = {};
        enrichedData.forEach((p) => {
          console.log(p)
          productMap[p.name.split("%%%")[1]] = p;
        });

        // Step 3: Find children in API `data` and attach to parents
        data
          .filter((p) => p.sub_product_of) // only those with a parent
          .forEach((child) => {
            // ✅ Current logic — attach to the real parent
            const parent = productMap[child.sub_product_of];
            if (parent) {
              parent.children.push(child);
            }
            // ➕ New logic — attach to other products with the same sub_product_of
            Object.values(productMap).forEach((possibleParent) => {
              if (
                possibleParent.id !== child.id && // not itself
                possibleParent.sub_product_of === child.sub_product_of // same parent reference
              ) {
                possibleParent.children.push(child);
              }
            });
          });
        console.log(enrichedData)
        setProducts(enrichedData);
      })
      .catch((err) => console.error("Fetch error:", err));

  }, [subscriptions]);

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

  const saveSettings = () => {
    fetch(
      "https://bot.kediritechnopark.com/webhook-test/user-production/data",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(settings)
      }
    )
      .then((res) => res.json())
      .then(() => {
        alert("Settings updated successfully!");
      })
      .catch((err) => alert("Error updating settings: " + err));
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Tabs Navigation */}
      <div className={styles.navTabs}>
        <button
          className={`${styles.floatMenuItem} ${activeTab === "products" ? styles.floatMenuItemActive : ""
            }`}
          onClick={() => setActiveTab("products")}
        >
          <span className={styles.floatMenuTitle}>Produk Saya</span>
          <Box size={16} className={styles.floatMenuIcon} />
        </button>

        <button
          className={`${styles.floatMenuItem} ${activeTab === "settings" ? styles.floatMenuItemActive : ""
            }`}
          onClick={() => setActiveTab("settings")}
        >
          <span className={styles.floatMenuTitle}>Profil Pengguna</span>
          <Settings size={16} className={styles.floatMenuIcon} />
        </button>

        <button
          className={`${styles.floatMenuItem} ${activeTab === "orders" ? styles.floatMenuItemActive : ""
            }`}
          onClick={() => setActiveTab("orders")}
        >
          <span className={styles.floatMenuTitle}>Pembelian</span>
          <ShoppingCart size={16} className={styles.floatMenuIcon} />
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <section className={styles.Section}>
          <div className={styles.coursesContainer}>
            <div className={styles.coursesGrid}>
              {products.map((product) => (
                <div
                  key={product.name}
                  className={`${styles.courseCard} ${hoveredCard === product.name ? styles.courseCardHover : ""
                    }`}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowedModal("product");
                  }}
                  onMouseEnter={() => setHoveredCard(product.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div>
                    <div
                      className={styles.courseImage}
                      style={{
                        backgroundImage: `url(${product.image})`
                      }}
                    />
                    <div className={styles.courseContentTop}>
                      <h3 className={styles.courseTitle}>
                        {product.name.split("%%%")[0]}
                      </h3>
                      <p className={styles.courseDesc}>
                        {product.description}
                      </p>
                    </div>
                  </div>
                  <div className={styles.courseContentBottom}>
                    <div className={styles.coursePrice}>
                      <span
                        className={
                          product.price === 0
                            ? styles.freePrice
                            : styles.currentPrice
                        }
                      >
                        {product.unit_type === "duration"
                          ? `Valid until: ${product.end_date
                            ? new Date(
                              product.end_date
                            ).toLocaleDateString()
                            : "N/A"
                          }`
                          : `SISA TOKEN ${product.quantity || 0}`}
                      </span>
                    </div>

                    <button
                      className="px-4 py-2 rounded-pill text-white"
                      style={{
                        background:
                          "linear-gradient(to right, #6a59ff, #8261ee)",
                        border: "none"
                      }}
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowedModal("product");
                        setWillDo('checkout');
                      }}
                    >
                      Perpanjang
                    </button>
                  </div>
                </div>
              ))}
              <div
                className={`${styles.courseCard} ${hoveredCard === 0 ? styles.courseCardHover : ""
                  }`}
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/?tab=products')
                }
              >
                <div>
                  + Tambah produk baru</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "settings" && (
        <section className={styles.profileSection}>
          <h2 className={styles.profileHeading}>Profil</h2>
          <div className={styles.sectionDivider}></div>

          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>Username</label>
              <input
                className={styles.inputField}
                value={settings.username}
                onChange={(e) =>
                  handleSettingsChange("username", e.target.value)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input
                className={styles.inputField}
                value={settings.email}
                onChange={(e) =>
                  handleSettingsChange("email", e.target.value)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.inputField}
                value={settings.profile_data.name}
                onChange={(e) =>
                  handleSettingsChange("name", e.target.value, true)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.inputField}
                value={settings.profile_data.phone}
                onChange={(e) =>
                  handleSettingsChange("phone", e.target.value, true)
                }
              />
            </div>
            <div className={styles.fullWidth}>
              <label className={styles.label}>Address</label>
              <input
                className={styles.inputField}
                value={settings.profile_data.address}
                onChange={(e) =>
                  handleSettingsChange("address", e.target.value, true)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Company</label>
              <input
                className={styles.inputField}
                value={settings.profile_data.company}
                onChange={(e) =>
                  handleSettingsChange("company", e.target.value, true)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Profile Image URL</label>
              <input
                className={styles.inputField}
                value={settings.profile_data.image}
                onChange={(e) =>
                  handleSettingsChange("image", e.target.value, true)
                }
              />
            </div>
          </div>

          <h2 className={styles.profileHeading}>Ganti password</h2>
          <div className={styles.sectionDivider}></div>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>New Password</label>
              <input
                className={styles.inputField}
                type="password"
                value={settings.password}
                onChange={(e) =>
                  handleSettingsChange("password", e.target.value)
                }
              />
            </div>
            <div>
              <label className={styles.label}>Re-type New Password</label>
              <input
                className={styles.inputField}
                type="password"
              />
            </div>
          </div>

          <button className={styles.saveButton} onClick={saveSettings}>
            Save Changes
          </button>
        </section>
      )}

      {activeTab === "orders" && (
        <section className={styles.Section}>
          <h2>My Orders</h2>
          <p>Orders list will be displayed here.</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
