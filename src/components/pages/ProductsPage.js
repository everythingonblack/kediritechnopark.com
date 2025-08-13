import React, { useState, useEffect } from 'react';
import ProductDetailPage from '../ProductDetailPage';
import Login from '../Login';
import styles from '../Styles.module.css';

const CoursePage = ({ subscriptions }) => {
    const [postLoginAction, setPostLoginAction] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showedModal, setShowedModal] = useState(null);
    const [products, setProducts] = useState([]);

    // Buka modal otomatis berdasarkan query
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const modal = urlParams.get('modal');
        const productId = urlParams.get('product_id');

        if (modal === 'product' && productId && products.length > 0) {
            const product = products.find(p => String(p.id) === productId);
            if (product) {
                setSelectedProduct(product);
                setShowedModal('product');
            }
        }
    }, [products]);

    useEffect(() => {
        if (!subscriptions) return;

        function groupSubscriptionsByProductName(subs) {
            const result = {};
            subs.forEach(sub => {
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

                if (sub.unit_type == 'token') {
                    result[name].quantity += sub.quantity ?? 0;
                } else {
                    result[name].quantity += 1;
                }

                result[name].subscriptions.push(sub);
            });

            return result;
        }

        const groupedSubs = groupSubscriptionsByProductName(subscriptions);
        const productIds = [...new Set(subscriptions.map(s => s.product_id))];

        fetch('https://bot.kediritechnopark.com/webhook/store-production/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsId: productIds }),
        })
            .then(res => res.json())
            .then(data => {
                const enrichedData = Object.values(groupedSubs)
                    .filter(group => data.some(p => p.id === group.product_id))
                    .map(group => {
                        const productData = data.find(p => p.id == group.product_id);
                        let image = productData?.image || '';
                        let description = productData?.description || '';
                        let site_url = productData?.site_url || '';
                        if (!image && productData?.sub_product_of) {
                            const parent = data.find(p => p.id === productData.sub_product_of);
                            console.log(parent)
                            image = parent?.image || '';
                            description = parent?.description || '';
                            site_url = parent?.site_url || '';
                        }
                        console.log(site_url)
                        return {
                            id: group.product_id,
                            name: group.product_name,
                            type: productData?.type || 'product',
                            image: image,
                            description: description,
                            site_url: site_url,
                            price: productData?.price || 0,
                            currency: productData?.currency || 'IDR',
                            duration: productData?.duration || {},
                            sub_product_of: productData?.sub_product_of || null,
                            is_visible: productData?.is_visible ?? true,
                            unit_type: productData?.unit_type || group.unit_type,
                            quantity: group.quantity,
                            end_date: group.end_date,
                            children: [],
                        };
                    });
                    console.log(enrichedData)
                setProducts(enrichedData);
            })
            .catch(err => console.error('Fetch error:', err));
    }, [subscriptions]);

    const features = [/* ... (tidak diubah) ... */];

    return (
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Courses Section */}
            <section className={styles.Section}>
                <div className={styles.coursesContainer}>
                    <h2 className={styles.coursesTitle}>MY PRODUCTS</h2>
                    <div className={styles.coursesGrid}>
                        {products &&
                            products[0]?.name &&
                            products.map(product => (
                                <div
                                    key={product.name}
                                    className={`${styles.courseCard} ${hoveredCard === product.name ? styles.courseCardHover : ''}`}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setShowedModal('product');
                                    }}
                                    onMouseEnter={() => setHoveredCard(product.name)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div>
                                        <div className={styles.courseImage} style={{ backgroundImage: `url(${product.image})` }} />
                                        <div className={styles.courseContentTop}>
                                            <h3 className={styles.courseTitle}>{product.name.split('%%%')[0]}</h3>
                                            <p className={styles.courseDesc}>{product.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles.courseContentBottom}>
                                        <div className={styles.coursePrice}>
                                            <span
                                                className={
                                                    product.price == 0
                                                        ? styles.freePrice
                                                        : styles.currentPrice
                                                }
                                            >
                                                {product.unit_type === 'duration'
                                                    ? `Valid until: ${product.end_date ? new Date(product.end_date).toLocaleDateString() : 'N/A'}`
                                                    : `SISA TOKEN ${product.quantity || 0}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {/* ... tidak berubah ... */}

            {/* Footer */}
            {/* ... tidak berubah ... */}

            {/* Unified Modal */}
            {showedModal && (
                <div
                    className={styles.modal}
                    onClick={() => {
                        setShowedModal(null);
                        setSelectedProduct({});
                    }}
                >
                    <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
                        {showedModal === 'product' && (
                            <div>
                                <ProductDetailPage
                                    setPostLoginAction={setPostLoginAction}
                                    setShowedModal={setShowedModal}
                                    product={selectedProduct}
                                    subscriptions={subscriptions}
                                    onClose={() => {
                                        setShowedModal(null);
                                        setSelectedProduct({});
                                    }}
                                />
                            </div>
                        )}
                        {showedModal === 'login' && (
                            <Login postLoginAction={postLoginAction} setPostLoginAction={setPostLoginAction} onClose={() => setShowedModal(null)} />
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default CoursePage;
