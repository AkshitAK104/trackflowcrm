import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { status: newStatus });
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(orderId);
        fetchOrders(); // Refresh the list
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statuses = ['all', 'Order Received', 'In Development', 'Ready to Dispatch', 'Dispatched'];

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h1>Orders Management</h1>
      
      <div className="filter-section">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-grid">
        {filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id}</h3>
              <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-details">
              <p><strong>Lead:</strong> {order.lead.name}</p>
              <p><strong>Company:</strong> {order.lead.company || 'N/A'}</p>
              <p><strong>Contact:</strong> {order.lead.contact}</p>
              
              {order.dispatch_date && (
                <p><strong>Dispatch Date:</strong> {new Date(order.dispatch_date).toLocaleDateString()}</p>
              )}
              
              {order.courier && <p><strong>Courier:</strong> {order.courier}</p>}
              {order.tracking_number && <p><strong>Tracking:</strong> {order.tracking_number}</p>}
              {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
              
              <p><strong>Created:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            </div>

            <div className="order-actions">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                className="status-select"
              >
                {statuses.slice(1).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => handleDelete(order.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-data">
          No orders found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default OrderList;
