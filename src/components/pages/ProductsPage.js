import React, { useState, useEffect } from 'react';
import ProductDetailPage from '../ProductDetailPage';
import Login from '../Login';
import styles from '../Styles.module.css';


function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function getDistinctProductIdsFromJwt(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.subscriptions || !payload.subscriptions) return [];

    const productIds = payload.subscriptions.map(p => p.product_id);
    return [...new Set(productIds)];
}

function getLatestEndDatesFromJwt(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.subscriptions || !payload.subscriptions) return {};

    const result = {};
    payload.subscriptions.forEach(p => {
        if (!p.end_date) return;
        const id = p.product_id;
        const endDate = new Date(p.end_date);
        if (!result[id] || endDate > new Date(result[id])) {
            result[id] = p.end_date;
        }
    });

    return result;
}
function getTotalTokenFromJwt(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.subscriptions || !payload.subscriptions) return {};

    const tokenQuantities = {};
    payload.subscriptions.forEach(p => {
        // Pastikan ada quantity dan unit_type token
        if (p.quantity && p.product_id) {
            tokenQuantities[p.product_id] = (tokenQuantities[p.product_id] || 0) + p.quantity;
        }
    });

    return tokenQuantities;
}


const CoursePage = () => {
    const [postLoginAction, setPostLoginAction] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [showedModal, setShowedModal] = useState(null);
    const [products, setProducts] = useState([]);
useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
        const token = match[2];

        const productIds = getDistinctProductIdsFromJwt(token);
        const endDates = getLatestEndDatesFromJwt(token);
        const tokenQuantitiesFromJwt = getTotalTokenFromJwt(token);

        fetch('https://bot.kediritechnopark.com/webhook/store-dev/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsId: productIds, type: 'product' }),
        })
            .then(res => res.json())
            .then(data => {
                const parentMap = {};
                const childrenMap = {};

                data.forEach(product => {
                    if (product.sub_product_of) {
                        const parentId = product.sub_product_of;
                        if (!childrenMap[parentId]) childrenMap[parentId] = [];
                        childrenMap[parentId].push(product);
                    } else {
                        parentMap[product.id] = {
                            ...product,
                            quantity: product.quantity || 0,
                            end_date: endDates[product.id] || null,
                            children: []
                        };
                    }
                });
// ...

Object.keys(childrenMap).forEach(parentId => {
    const parent = parentMap[parentId];
    const children = childrenMap[parentId];

    if (parent) {
        parent.children = children;

        // Pakai quantity dari JWT langsung (tokenQuantitiesFromJwt)
        parent.quantity = children.reduce((total, child) => {
            return total + (tokenQuantitiesFromJwt[child.id] || 0);
        }, 0);
    }
});

// ...

// Update quantity untuk produk yang bukan parent dan bukan anak
Object.values(parentMap).forEach(product => {
    if (!product.children.length) {
        if (product.unit_type === 'token') {
            product.quantity = tokenQuantitiesFromJwt[product.id] || 0;
        }
    }
});

                const enrichedData = Object.values(parentMap);
                setProducts(enrichedData);
                console.log(enrichedData);
            })
            .catch(err => console.error('Fetch error:', err));
    }
}, []);


    const features = [
        {
            icon: '🌐',
            title: 'Belajar Langsung dari Mentor Terbaik',
            description:
                'Kursus kami dirancang dan dipandu oleh para praktisi, pengajar, dan mentor yang ahli di bidangnya—mulai dari bisnis digital, teknologi, desain, hingga kecerdasan buatan. Semua materi disemakan dengan bahasa yang sederhana, mudah dipahami, dan langsung bisa dipraktikkan.',
        },
        {
            icon: '⏰',
            title: 'Fleksibel Sesuai Gaya Hidupmu',
            description:
                'Sibuk kerja? Urus anak? Atau lagi nyantai belajar Teknilog, di Akademi ini kamu bisa belajar kapan saja di mana saja, tanpa terikat waktu. Semua kursus kami bisa diakses ulang dan kamu bebas atur ritme belajar mu sendiri. Bebas lekukan, makamali ngatif.',
        },
        {
            icon: '⚡',
            title: 'Belajar Cepat, Dampak Nyata',
            description:
                'Kami percaya proses belajar tidak harus lama lama! Dengan pendekatan yang tepat, kamu bisa menguasai keterampilan baru hanya dalam hitungan minggu—buken bulan! Mulai dari belajar desain, digital marketing, AI, hingga manajemen usaha, semua bisa kamu kuasai dengan cepat dan tepat guna.',
        },
    ];

    return (
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

            {/* Courses Section */}
            <section className={styles.Section}>
                <div className={styles.coursesContainer}>
                    <h2 className={styles.coursesTitle}>MY PRODUCTS</h2>
                    <div className={styles.coursesGrid}>
                        {products &&
                            products[0]?.name &&
                            products
                                .map(product => (
                                    <div
                                        key={product.id}
                                        className={`${styles.courseCard} ${hoveredCard === product.id ? styles.courseCardHover : ''}`}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowedModal('product');
                                        }}
                                        onMouseEnter={() => setHoveredCard(product.id)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div className={styles.courseImage} style={{ backgroundImage: `url(${product.image})` }}>
                                            {product.price == 0 && (
                                                <span className={styles.courseLabel}>Free</span>
                                            )}
                                        </div>
                                        <div className={styles.courseContent}>
                                            <h3 className={styles.courseTitle}>{product.name}</h3>
                                            <p className={styles.courseDesc}>{product.description}</p>
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
                                                        : `SISA TOKEN ${product.quantity || 0}`
                                                    }

                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.Section}>
                <div className={styles.featuresContainer}>
                    <h2 className={styles.featuresTitle}>Mengapa Memilih Akademi Kami?</h2>
                    <p className={styles.featuresDescription}>
                        Di era digital yang terus berubah, Akademi kami hadir sebagai ruang tumbuh untuk siapa saja yang ingin berkembang.
                        Baik pelajar, profesional, UMKM, hingga pemula teknologi—kami bantu kamu naik level dengan materi praktis,
                        akses mudah, dan komunitas suportif.
                    </p>
                    <div className={styles.featuresList}>
                        {features.map((feature, index) => (
                            <div key={index} className={styles.featureItem}>
                                <div className={styles.featureIcon}>{feature.icon}</div>
                                <div className={styles.featureContent}>
                                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                                    <p className={styles.featureDescription}>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.Section}>
                <div className={styles.ctaContainer}>
                    <div className={styles.ctaCard}>
                        <div>
                            <div className={styles.ctaIcon}>😊</div>
                            <h3 className={styles.ctaTitle}>Murid Daftar Disini</h3>
                            <p className={styles.ctaDescription}>
                                Ambil langkah pertama menuju karier impian atau hobi barumu bersama Akademi Kami.
                                Belajar dengan cara yang menyenangkan, fleksibel, dan penuh manfaat.
                            </p>
                        </div>
                        <button className={styles.ctaButton}>START LEARNING</button>
                    </div>

                    <div className={styles.ctaCard}>
                        <div>
                            <div className={styles.ctaIcon}>👨‍🏫</div>
                            <h3 className={styles.ctaTitle}>Guru Daftar Disini</h3>
                            <p className={styles.ctaDescription}>
                                Ajarkan apa yang kamu cintai. Akademi kami memberikan semua alat
                                dan dukungan yang kamu butuhkan untuk membuat kursusmu sendiri.
                            </p>
                        </div>
                        <button className={styles.ctaButton}>START TEACHING</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <p className={styles.footerText}>Created by Academy Kediri Techno Park</p>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialLink}>📷</a>
                        <a href="#" className={styles.socialLink}>📱</a>
                        <a href="#" className={styles.socialLink}>📧</a>
                    </div>
                </div>
            </footer>

            {/* Unified Modal */}
            {showedModal && (
                <div
                    className={styles.modal}
                    onClick={() => {
                        setShowedModal(null);
                        setSelectedProduct({});
                    }}
                >
                    <div
                        className={styles.modalBody}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {showedModal === 'product' && (
                            <ProductDetailPage
                                setPostLoginAction={setPostLoginAction}
                                setShowedModal={setShowedModal}
                                product={selectedProduct}
                                onClose={() => {
                                    setShowedModal(null);
                                    setSelectedProduct({});
                                }}
                            />
                        )}
                        {showedModal === 'login' && (
                            <Login postLoginAction={postLoginAction} setPostLoginAction={setPostLoginAction} onClose={() => setShowedModal(null)} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursePage;
