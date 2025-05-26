import React, { useState } from 'react';
import { leadsAPI } from '../services/api';

const LeadForm = ({ onSuccess, editLead = null }) => {
  const [formData, setFormData] = useState({
    name: editLead?.name || '',
    contact: editLead?.contact || '',
    company: editLead?.company || '',
    product_interest: editLead?.product_interest || '',
    stage: editLead?.stage || 'New',
    follow_up_date: editLead?.follow_up_date ? editLead.follow_up_date.split('T')[0] : '',
    notes: editLead?.notes || '',
  });

  const [loading, setLoading] = useState(false);

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
        follow_up_date: formData.follow_up_date ? new Date(formData.follow_up_date).toISOString() : null,
      };

      if (editLead) {
        await leadsAPI.update(editLead.id, submitData);
      } else {
        await leadsAPI.create(submitData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Error saving lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  return (
    <div className="form-container">
      <h1>{editLead ? 'Edit Lead' : 'Add New Lead'}</h1>
      
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact">Contact *</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="product_interest">Product Interest</label>
          <input
            type="text"
            id="product_interest"
            name="product_interest"
            value={formData.product_interest}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="stage">Stage</label>
          <select
            id="stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
          >
            {stages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="follow_up_date">Follow-up Date</label>
          <input
            type="date"
            id="follow_up_date"
            name="follow_up_date"
            value={formData.follow_up_date}
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
          {loading ? 'Saving...' : (editLead ? 'Update Lead' : 'Add Lead')}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
