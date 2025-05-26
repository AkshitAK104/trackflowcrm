import React, { useState, useEffect } from 'react';
import { leadsAPI } from '../services/api';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadsAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageUpdate = async (leadId, newStage) => {
    try {
      await leadsAPI.update(leadId, { stage: newStage });
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead stage:', error);
    }
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsAPI.delete(leadId);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter(lead => lead.stage === filter);
  const stages = ['all', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  const getStageColor = (stage) => {
    const colors = {
      'New': 'blue',
      'Contacted': 'orange',
      'Qualified': 'yellow',
      'Proposal Sent': 'purple',
      'Won': 'green',
      'Lost': 'red'
    };
    return colors[stage] || 'gray';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading leads...</p>
    </div>
  );

  return (
    <div className="leads-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="title-icon">👥</span>
          Leads Management
        </h1>
        <div className="filter-section">
          <label htmlFor="stage-filter">Filter by stage:</label>
          <select
            id="stage-filter"
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {stages.map(stage => (
              <option key={stage} value={stage}>
                {stage === 'all' ? 'All Stages' : stage}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="leads-grid">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="lead-card">
            <div className="lead-header">
              <h3 className="lead-name">{lead.name}</h3>
              <span className={`stage-badge stage-${getStageColor(lead.stage)}`}>
                {lead.stage}
              </span>
            </div>
            
            <div className="lead-details">
              <div className="detail-row">
                <span className="detail-icon">📞</span>
                <div className="detail-content">
                  <strong>Contact:</strong> {lead.contact}
                </div>
              </div>
              
              {lead.company && (
                <div className="detail-row">
                  <span className="detail-icon">🏢</span>
                  <div className="detail-content">
                    <strong>Company:</strong> {lead.company}
                  </div>
                </div>
              )}
              
              {lead.product_interest && (
                <div className="detail-row">
                  <span className="detail-icon">💡</span>
                  <div className="detail-content">
                    <strong>Interest:</strong> {lead.product_interest}
                  </div>
                </div>
              )}
              
              {lead.follow_up_date && (
                <div className="detail-row">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <strong>Follow-up:</strong> {new Date(lead.follow_up_date).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {lead.notes && (
                <div className="detail-row notes">
                  <span className="detail-icon">📝</span>
                  <div className="detail-content">
                    <strong>Notes:</strong> {lead.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="lead-actions">
              <select
                className="stage-select"
                value={lead.stage}
                onChange={(e) => handleStageUpdate(lead.id, e.target.value)}
              >
                {stages.slice(1).map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <button
                className="delete-btn"
                onClick={() => handleDelete(lead.id)}
                title="Delete lead"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No leads found</h3>
          <p>No leads match your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LeadList;
