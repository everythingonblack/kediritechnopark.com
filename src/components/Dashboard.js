import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from 'lucide-react';
import styles from './Dashboard.module.css';
import processProducts from '../helper/processProducts';


const Dashboard = () => {
  const [unitType, setUnitType] = useState('duration');
  const [durationUnit, setDurationUnit] = useState('day');
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [products, setProducts] = useState([]);


  const [dashboardData, setDashboardData] = useState({
    totalRevenue: {
      amount: 10215845,
      currency: 'IDR',
      change: 33.87,
      period: '22 - 29 May 2025'
    },
    totalItemsSold: {
      amount: 128980,
      change: -33.87,
      period: '22 - 29 May 2025'
    },
    totalVisitors: {
      amount: 2905897,
      change: 33.87,
      period: '22 - 29 May 2025'
    },
    chartData: [
      { date: '22/06', items: 200, revenue: 800 },
      { date: '23/06', items: 750, revenue: 450 },
      { date: '24/06', items: 550, revenue: 200 },
      { date: '25/06', items: 300, revenue: 350 },
      { date: '26/06', items: 900, revenue: 450 },
      { date: '27/06', items: 550, revenue: 200 },
    ],
    latestTransactions: [
      {
        id: 1,
        name: 'Samantha William',
        amount: 250875,
        date: 'May 22, 2025',
        status: 'confirmed',
        avatar: 'SW'
      },
      {
        id: 2,
        name: 'Kevin Anderson',
        amount: 350620,
        date: 'May 22, 2025',
        status: 'waiting payment',
        avatar: 'KA'
      },
      {
        id: 3,
        name: 'Angela Samantha',
        amount: 870563,
        date: 'May 22, 2025',
        status: 'confirmed',
        avatar: 'AS'
      },
      {
        id: 4,
        name: 'Michael Smith',
        amount: 653975,
        date: 'May 22, 2025',
        status: 'payment expired',
        avatar: 'MS'
      },
      {
        id: 5,
        name: 'Jonathan Sebastian',
        amount: 950000,
        date: 'May 22, 2025',
        status: 'confirmed',
        avatar: 'JS'
      }
    ]
  });

  useEffect(() => {
    const fetchDistinctOptions = async () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (!match) return;
      const token = match[2];

      try {
        const res = await fetch('https://bot.kediritechnopark.com/webhook/store-dev/get-products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json(); // hasil berupa array produk
        const products = result || [];

        // Ambil distinct `type` dan `group` manual
        const types = [...new Set(products.map(p => p.type).filter(Boolean))];
        const groups = [...new Set(products.map(p => p.group).filter(Boolean))];

        setAvailableTypes(types);
        setAvailableGroups(groups);
        setProducts(processProducts(products));
      } catch (err) {
        console.error('Gagal ambil produk:', err);
      }
    };

    fetchDistinctOptions();
  }, []);


  const sendDataToN8N = async (webhookUrl, data) => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) {
      const token = match[2];

      const payload = {
        ...data,
        duration: data.unit_type === 'token' ? null : data.duration,
        quantity: data.unit_type === 'duration' ? null : data.quantity,
      };

      if (!token) {
        alert('Token tidak ditemukan. Silakan login kembali.');
        return;
      }

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert('Dorm berhasil ditambahkan!');
        } else {
          const errorText = await response.text();
          console.error('Response Error:', errorText);
          alert('Gagal mengirim data: ' + response.status);
        }
      } catch (error) {
        console.error('Error sending data to n8n:', error);
        alert('Terjadi kesalahan saat mengirim data.');
      }
    }
  };

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
        {/* Chart and Transactions UI as before */}
      </div>

        {/* <div className={styles.chartCard}>
          <div className={styles.transactionsHeader}>
            <h3 className={styles.transactionsTitle}>Latest Transactions</h3>
            <a href="#" className={styles.seeAllLink}>see all</a>
          </div>

          <div className={styles.transactionsList}>
            {products.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionLeft}>
                  <div className={styles.transactionInfo}>
                    <h4>{transaction.name}</h4>
                    <p>on {transaction.date}</p>
                  </div>
                </div>

                <div className={styles.transactionRight}>
                  <span className={styles.transactionAmount}>
                    IDR {formatCurrency(transaction.amount)}
                  </span>
                  <div className={`${styles.statusIndicator} ${getStatusClass(transaction.status)}`}></div>
                  <span className={styles.transactionStatus}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <div className={styles.chartCard}>
          <div className={styles.transactionsHeader}>
            <h3 className={styles.transactionsTitle}>Products</h3>
          </div>

          <div className={styles.transactionsList}>
            {products.map((product) => (
              <div key={product.id} className={styles.transactionItem}>
                <div className={styles.transactionLeft}>
                  <div className={styles.transactionInfo}>
                    <h4>{product.name}</h4>
                                {product.children && product.children.map((child) => (

                    <p>- {child.name}</p>
                                ))}
                  </div>
                </div>

                <div className={styles.transactionRight}>
                  <span className={styles.transactionAmount}>
                    IDR {formatCurrency(product.amount)}
                  </span>
                  <div className={`${styles.statusIndicator} ${getStatusClass(product.status)}`}></div>
                  <span className={styles.transactionStatus}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      <div className={styles.chartCard} style={{ marginTop: '2rem' }}>
        <h3 className={styles.transactionsTitle}>Tambah Produk Baru</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            const isToken = unitType === 'token';
            const durationValue = form.duration_value?.value;
            const quantityValue = form.duration_quantity?.value;

            const dormData = {
              name: form.name.value,
              type: selectedType,
              image: form.image.value,
              description: form.description.value,
              price: parseInt(form.price.value, 10),
              currency: 'IDR',
              duration: isToken ? null : { [durationUnit]: parseInt(durationValue, 10) },
              quantity: isToken ? parseInt(quantityValue, 10) : null,
              unit_type: unitType,
              sub_product_of: null,
              is_visible: isVisible,
              group: selectedGroup,
              site_url: form.site_url.value || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            sendDataToN8N('https://bot.kediritechnopark.com/webhook/store-dev/add-product', dormData);
          }}
          className={styles.form}
        >
          <div className={styles.formGroup}>
            <label>Nama Produk</label>
            <input type="text" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label>Deskripsi</label>
            <textarea name="description" rows={3} required />
          </div>
          <div className={styles.formGroup}>
            <label>Harga</label>
            <input type="number" name="price" required />
          </div>
          <div className={styles.formGroup}>
            <label>Jenis Unit</label>
            <select
              name="unit_type"
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              required
            >
              <option value="duration">Durasi</option>
              <option value="token">Token</option>
            </select>
          </div>

          {unitType === 'token' ? (
            <div className={styles.formGroup}>
              <label>Jumlah Token</label>
              <input type="number" name="duration_quantity" required min="1" />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label>Durasi</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" name="duration_value" min="1" required />
                <select name="duration_unit" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)} required>
                  <option value="day">Hari</option>
                  <option value="week">Minggu</option>
                  <option value="month">Bulan</option>
                </select>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>URL Gambar</label>
            <input type="text" name="image" />
          </div>

          <div className={styles.formGroup}>
            <label>Site URL (opsional)</label>
            <input type="text" name="site_url" />
          </div>
          <div className={styles.formGroup}>
            <label>Tipe Produk</label>
            <input
              type="text"
              name="type"
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value)}
              required
            />
            <div className={styles.suggestionContainer}>
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={styles.suggestionButton}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Group</label>
            <input
              type="text"
              name="group"
              value={selectedGroup || ''}
              onChange={(e) => setSelectedGroup(e.target.value)}
            />
            <div className={styles.suggestionContainer}>
              {availableGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={styles.suggestionButton}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>Buat Produk</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
