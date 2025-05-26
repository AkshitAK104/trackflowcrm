import React from 'react';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'leads', label: 'Leads', icon: '👥' },
    { key: 'add-lead', label: 'Add Lead', icon: '➕' },
    { key: 'orders', label: 'Orders', icon: '📦' },
    { key: 'add-order', label: 'Add Order', icon: '🛒' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <div className="nav-brand">
          <span className="brand-icon">🚀</span>
          <h2>TrackFlow CRM</h2>
        </div>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.key} className="nav-item">
            <button
              className={`nav-link ${currentView === item.key ? 'active' : ''}`}
              onClick={() => setCurrentView(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
