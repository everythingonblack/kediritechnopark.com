import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
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
      { date: '24/06', items: 300, revenue: 350 },
      { date: '24/06', items: 900, revenue: 450 },
      { date: '24/06', items: 550, revenue: 200 },
      { date: '24/06', items: 700, revenue: 300 }
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

  // Function untuk connect ke n8n webhook
  const connectToN8NWebhook = async (webhookUrl) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error connecting to n8n webhook:', error);
    }
  };

  // Function untuk send data ke n8n webhook
  const sendDataToN8N = async (webhookUrl, data) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        console.log('Data sent successfully to n8n');
      }
    } catch (error) {
      console.error('Error sending data to n8n:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'waiting payment':
        return styles.statusWaiting;
      case 'payment expired':
        return styles.statusExpired;
      default:
        return styles.statusConfirmed;
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
              <div
                className={`${styles.bar} ${styles.barItems}`}
                style={{
                  height: `${(item.items / maxValue) * 200}px`
                }}
              />
              <div
                className={`${styles.bar} ${styles.barRevenue}`}
                style={{
                  height: `${(item.revenue / maxValue) * 200}px`
                }}
              />
            </div>
            <span className={styles.barLabel}>{item.date}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Revenue"
          value={dashboardData.totalRevenue.amount}
          currency={dashboardData.totalRevenue.currency}
          change={dashboardData.totalRevenue.change}
          period={dashboardData.totalRevenue.period}
          icon={DollarSign}
          isNegative={false}
        />
        <StatCard
          title="Total Items Sold"
          value={dashboardData.totalItemsSold.amount}
          change={dashboardData.totalItemsSold.change}
          period={dashboardData.totalItemsSold.period}
          icon={ShoppingCart}
          isNegative={true}
        />
        <StatCard
          title="Total Visitor"
          value={dashboardData.totalVisitors.amount}
          change={dashboardData.totalVisitors.change}
          period={dashboardData.totalVisitors.period}
          icon={Users}
          isNegative={false}
        />
      </div>

      {/* Charts and Transactions */}
      <div className={styles.chartsGrid}>
        {/* Report Statistics */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Report Statistics</h3>
              <p className={styles.chartSubtitle}>Period: 22 - 29 May 2025</p>
            </div>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.legendColorGreen}`}></div>
                <span className={styles.legendText}>Items Sold</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.legendColorLightGreen}`}></div>
                <span className={styles.legendText}>Revenue</span>
              </div>
            </div>
          </div>
          <BarChart data={dashboardData.chartData} />
        </div>

        {/* Latest Transactions */}
        <div className={styles.chartCard}>
          <div className={styles.transactionsHeader}>
            <h3 className={styles.transactionsTitle}>Latest Transactions</h3>
            <a href="#" className={styles.seeAllLink}>see all transactions</a>
          </div>
          
          <div className={styles.transactionsList}>
            {dashboardData.latestTransactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionLeft}>
                  <div className={styles.transactionAvatar}>
                    {transaction.avatar}
                  </div>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
