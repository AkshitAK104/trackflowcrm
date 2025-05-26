import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadList />;
      case 'add-lead':
        return <LeadForm onSuccess={() => setCurrentView('leads')} />;
      case 'orders':
        return <OrderList />;
      case 'add-order':
        return <OrderForm onSuccess={() => setCurrentView('orders')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <main className="main-content">
        <div className="content-wrapper">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
