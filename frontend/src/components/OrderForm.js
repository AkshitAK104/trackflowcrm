import React, { useState, useEffect } from 'react';
import { ordersAPI, leadsAPI } from '../services/api';

const OrderForm = ({ onSuccess, editOrder = null }) => {
  const [formData, setFormData] = useState({
    lead_id: editOrder?.lead_id || '',
    status: editOrder?.status || 'Order Received',
    dispatch_date: editOrder?.dispatch_date ? editOrder.dispatch_date.split('T')[0] : '',
    courier: editOrder?.courier || '',
    tracking_number: editOrder?.tracking_number || '',
    notes: editOrder?.notes || '',
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadsAPI.getAll();
      // Filter to show only won leads for new orders
      const wonLeads = response.data.filter(lead => lead.stage === 'Won');
      setLeads(wonLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        lead_id: parseInt(formData.lead_id),
        dispatch_date: formData.dispatch_date ? new Date(formData.dispatch_date).toISOString() : null,
      };

      if (editOrder) {
        await ordersAPI.update(editOrder.id, submitData);
      } else {
        await ordersAPI.create(submitData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['Order Received', 'In Development', 'Ready to Dispatch', 'Dispatched'];

  return (
    <div className="form-container">
      <h1>{editOrder ? 'Edit Order' : 'Add New Order'}</h1>
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label htmlFor="lead_id">Lead *</label>
          <select
            id="lead_id"
            name="lead_id"
            value={formData.lead_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a lead</option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.name} - {lead.company || 'No Company'}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dispatch_date">Dispatch Date</label>
          <input
            type="date"
            id="dispatch_date"
            name="dispatch_date"
            value={formData.dispatch_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="courier">Courier</label>
          <input
            type="text"
            id="courier"
            name="courier"
            value={formData.courier}
            onChange={handleChange}
            placeholder="e.g., FedEx, UPS, DHL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tracking_number">Tracking Number</label>
          <input
            type="text"
            id="tracking_number"
            name="tracking_number"
            value={formData.tracking_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Saving...' : (editOrder ? 'Update Order' : 'Add Order')}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
