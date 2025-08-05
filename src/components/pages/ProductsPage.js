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

    useEffect(() => {
        if (!subscriptions) return;

        // Step 1: Group subscriptions by product_name
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

                // Update end_date jika lebih baru
                const currentEnd = new Date(result[name].end_date);
                const thisEnd = new Date(sub.end_date);
                if (thisEnd > currentEnd) {
                    result[name].end_date = sub.end_date;
                }

                // Tambahkan quantity jika unit_type adalah 'token'
                if (sub.unit_type == 'token') {
                    result[name].quantity += sub.quantity ?? 0;
                } else {
                    result[name].quantity += 1; // Bisa diabaikan atau tetap hitung 1 per subscription
                }

                result[name].subscriptions.push(sub);

            });

            return result;
        }

        const groupedSubs = groupSubscriptionsByProductName(subscriptions);

        // Step 2: Ambil semua unique product_id (tetap diperlukan untuk ambil metadata dari API)
        const productIds = [...new Set(subscriptions.map(s => s.product_id))];

        // Step 3: Fetch product metadata
        fetch('https://bot.kediritechnopark.com/webhook/store-dev/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemsId: productIds, type: 'product' }),
        })
            .then(res => res.json())
            .then(data => {
                const enrichedData = Object.values(groupedSubs)
    .filter(group => data.some(p => p.id === group.product_id)) // ✅ hanya produk yang ada di metadata
    .map(group => {
        const productData = data.find(p => p.id == group.product_id);

        // Cek fallback image dari parent jika image kosong dan sub_product_of ada
        let image = productData?.image || '';
        if (!image && productData?.sub_product_of) {
            const parent = data.find(p => p.id === productData.sub_product_of);
            image = parent?.image || '';
        }

        return {
            id: group.product_id,
            name: group.product_name,
            type: productData?.type || 'product',
            image: image,
            description: productData?.description || '',
            price: productData?.price || 0,
            currency: productData?.currency || 'IDR',
            duration: productData?.duration || {},
            sub_product_of: productData?.sub_product_of || null,
            is_visible: productData?.is_visible ?? true,
            unit_type: productData?.unit_type || group.unit_type,
            quantity: group.quantity,
            end_date: group.end_date,
            children: []
        };
    });

                console.log(enrichedData)
                setProducts(enrichedData);
                console.log('Enriched Data:', enrichedData);
            })
            .catch(err => console.error('Fetch error:', err));
    }, [subscriptions]);



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
                                        key={product.name}
                                        className={`${styles.courseCard} ${hoveredCard === product.name ? styles.courseCardHover : ''}`}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowedModal('product');
                                        }}
                                        onMouseEnter={() => setHoveredCard(product.name)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div className={styles.courseImage} style={{ backgroundImage: `url(${product.image})` }}>
                                            {/* {product.price == 0 && (
                                                <span className={styles.courseLabel}>Free</span>
                                            )} */}
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
