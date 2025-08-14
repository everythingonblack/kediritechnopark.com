import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Plus, GitBranchPlus } from 'lucide-react';
import styles from './Dashboard.module.css';
import processProducts from '../helper/processProducts';

/**
 * Props:
 * - setShowedModal: (modalName: string, productId?: string|number) => void
 */
const Dashboard = ({ setShowedModal }) => {
  const [unitType, setUnitType] = useState('duration');          // kept for potential reuse
  const [durationUnit, setDurationUnit] = useState('days');      // kept for potential reuse
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [products, setProducts] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: { amount: 10215845, currency: 'IDR', change: 33.87, period: '22 - 29 May 2025' },
    totalItemsSold: { amount: 128980, change: -33.87, period: '22 - 29 May 2025' },
    totalVisitors: { amount: 2905897, change: 33.87, period: '22 - 29 May 2025' },
    chartData: [
      { date: '22/06', items: 200, revenue: 800 },
      { date: '23/06', items: 750, revenue: 450 },
      { date: '24/06', items: 550, revenue: 200 },
      { date: '25/06', items: 300, revenue: 350 },
      { date: '26/06', items: 900, revenue: 450 },
      { date: '27/06', items: 550, revenue: 200 },
    ],
    latestTransactions: []
  });

  useEffect(() => {
    const fetchDistinctOptions = async () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (!match) return;
      const token = match[2];

      try {
        const res = await fetch('https://bot.kediritechnopark.com/webhook/store-production/get-products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        const productsArr = result || [];

        const types = [...new Set(productsArr.map(p => p.type).filter(Boolean))];
        const groups = [...new Set(productsArr.map(p => p.group).filter(Boolean))];

        setAvailableTypes(types);
        setAvailableGroups(groups);
        setProducts(processProducts(productsArr));
      } catch (err) {
        console.error('Gagal ambil produk:', err);
      }
    };

    fetchDistinctOptions();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID').format(amount);

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return styles.statusConfirmed;
      case 'waiting payment': return styles.statusWaiting;
      case 'payment expired': return styles.statusExpired;
      default: return styles.statusConfirmed;
    }
  };

  const StatCard = ({ title, value, currency, change, period, icon: Icon, isNegative }) => (
    <div className={styles.statCard}>
      <div className={styles.statCardHeader}>
        <h3 className={styles.statCardTitle}>{title}</h3>
        <Icon className={styles.statCardIcon} />
      </div>
      <div className={styles.statCardValue}>
        {currency && `${currency} `}{formatCurrency(value)}
      </div>
      <div className={styles.statCardFooter}>
        <div className={styles.statCardChange}>
          {isNegative ? (
            <TrendingDown className={`${styles.trendIcon} ${styles.trendDown}`} />
          ) : (
            <TrendingUp className={`${styles.trendIcon} ${styles.trendUp}`} />
          )}
          <span className={`${styles.changeText} ${isNegative ? styles.changeTextNegative : styles.changeTextPositive}`}>
            {Math.abs(change)}%
          </span>
          <span className={styles.fromLastWeek}>from last week</span>
        </div>
      </div>
      <div className={styles.statCardPeriod}>{period}</div>
    </div>
  );

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(item => Math.max(item.items, item.revenue)));
    return (
      <div className={styles.barChart}>
        {data.map((item, index) => (
          <div key={index} className={styles.barGroup}>
            <div className={styles.barContainer}>
              <div className={`${styles.bar} ${styles.barItems}`} style={{ height: `${(item.items / maxValue) * 200}px` }} />
              <div className={`${styles.bar} ${styles.barRevenue}`} style={{ height: `${(item.revenue / maxValue) * 200}px` }} />
            </div>
            <span className={styles.barLabel}>{item.date}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <StatCard title="Total Revenue" value={dashboardData.totalRevenue.amount} currency="IDR" change={dashboardData.totalRevenue.change} period={dashboardData.totalRevenue.period} icon={DollarSign} isNegative={false} />
        <StatCard title="Total Items Sold" value={dashboardData.totalItemsSold.amount} change={dashboardData.totalItemsSold.change} period={dashboardData.totalItemsSold.period} icon={ShoppingCart} isNegative={true} />
        <StatCard title="Total Visitor" value={dashboardData.totalVisitors.amount} change={dashboardData.totalVisitors.change} period={dashboardData.totalVisitors.period} icon={Users} isNegative={false} />
      </div>

      <div className={styles.chartsGrid}>
        {/* Tempatkan <BarChart data={dashboardData.chartData} /> jika mau ditampilkan */}
      </div>

      {/* Products List */}
      <div className={styles.chartCard}>
        <div className={styles.transactionsHeader}>
          <h3 className={styles.transactionsTitle}>Products</h3>

          {/* Tombol "Buat Item" → buka modal create */}
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setShowedModal && setShowedModal('create-item')}
            title="Buat produk baru"
          >
            <Plus size={16} style={{ marginRight: 6 }} />
            Buat Item
          </button>
        </div>

        <div className={styles.transactionsList}>
          {products.map((product) => (
            <div key={product.id} className={styles.transactionItem}>
              <div className={styles.transactionLeft}>
                <div className={styles.transactionInfo}>
                  <h4>{product.name}</h4>
                  {product.children && product.children.map((child) => (
                    <p key={child.id}>- {child.name}</p>
                  ))}
                </div>
              </div>

              <div className={styles.transactionRight}>
                <span className={styles.transactionAmount}>
                  IDR {formatCurrency(product.price)}
                </span>
                <div className={`${styles.statusIndicator} ${getStatusClass(product.status)}`}></div>
                <span className={styles.transactionStatus}>{product.status}</span>

                {/* Tombol "Add Child" → buka modal create dengan parent product_id */}
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setShowedModal('create-item', product.id)}
                  title="Tambah sub-produk"
                  style={{ marginLeft: '0.75rem' }}
                >
                  <GitBranchPlus size={16} style={{ marginRight: 6 }} />
                  Add Child
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian form create yang lama sudah DIPINDAH ke halaman/komponen baru */}
    </div>
  );
};

export default Dashboard;
