import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  );

  const statCards = [
    { 
      title: 'Total Leads', 
      value: stats?.total_leads || 0, 
      icon: '👥', 
      color: 'blue',
      description: 'All leads in system'
    },
    { 
      title: 'Open Leads', 
      value: stats?.open_leads || 0, 
      icon: '🔓', 
      color: 'orange',
      description: 'Active opportunities'
    },
    { 
      title: 'Won Leads', 
      value: stats?.won_leads || 0, 
      icon: '🏆', 
      color: 'green',
      description: 'Successful conversions'
    },
    { 
      title: 'Conversion Rate', 
      value: `${stats?.conversion_rate || 0}%`, 
      icon: '📈', 
      color: 'purple',
      description: 'Success percentage'
    },
    { 
      title: 'Total Orders', 
      value: stats?.total_orders || 0, 
      icon: '📦', 
      color: 'teal',
      description: 'Orders processed'
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span className="title-icon">📊</span>
          Dashboard Overview
        </h1>
        <p className="dashboard-subtitle">Track your business performance at a glance</p>
      </div>
      
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon-container">
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-number">{stat.value}</div>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
