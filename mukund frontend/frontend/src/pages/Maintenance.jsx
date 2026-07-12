import React, { useState, useMemo } from 'react';
import { Plus, Search, CheckCircle, Wrench, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import classes from './List.module.css';

const Maintenance = () => {
  const { maintenance, vehicles, logMaintenance, closeMaintenance } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({ vehicleId: '', description: '', cost: '' });

  const availableVehicles = vehicles.filter(v => v.status !== 'Retired');
  const statuses = ['All', 'Open', 'Closed'];

  const filtered = useMemo(() => {
    return maintenance.slice().reverse().filter(m => {
      const v = vehicles.find(veh => veh.id === m.vehicleId);
      const matchSearch = m.description.toLowerCase().includes(search.toLowerCase()) ||
        (v?.regNumber || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || m.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [maintenance, search, filterStatus, vehicles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    logMaintenance({ ...formData, cost: Number(formData.cost) });
    setShowForm(false);
    setFormData({ vehicleId: '', description: '', cost: '' });
  };

  const totalOpenCost = useMemo(() =>
    maintenance.filter(m => m.status === 'Open').reduce((s, m) => s + m.cost, 0)
  , [maintenance]);

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h2>Maintenance Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Wrench size={16} /> {showForm ? 'Cancel' : 'Log Maintenance'}
        </button>
      </div>

      {showForm && (
        <div className={`glass-panel ${classes.formContainer}`}>
          <h3>Create Maintenance Record</h3>
          <div className={classes.infoText}>
            <AlertTriangle size={13} style={{ color: 'var(--color-warning)' }} />
            Logging maintenance will set the vehicle status to "In Shop" automatically.
          </div>
          <form onSubmit={handleSubmit} className={classes.gridForm}>
            <div className="form-group"><label className="form-label">Select Vehicle</label>
              <select className="form-select" required value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}>
                <option value="" disabled>Select a vehicle</option>
                {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber} — {v.name} ({v.status})</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Issue / Task Description</label><input type="text" className="form-input" required placeholder="e.g. Brake pad replacement" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Estimated Cost (₹)</label><input type="number" min="0" className="form-input" required placeholder="e.g. 8500" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} /></div>
            <div className={classes.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Record</button>
            </div>
          </form>
        </div>
      )}

      <div className={classes.toolbar}>
        <div className={classes.searchBox}>
          <Search size={15} className={classes.searchIcon} />
          <input className={classes.searchInput} placeholder="Search by vehicle or description…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {statuses.map(s => (
            <button key={s} className={`${classes.filterBtn} ${filterStatus === s ? classes.activeFilter : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className={classes.tableStats}>
        <div className={classes.tableStat}>Showing <strong>{filtered.length}</strong> of <strong>{maintenance.length}</strong> records</div>
        {totalOpenCost > 0 && (
          <div className={classes.tableStat} style={{ color: 'var(--color-warning)' }}>
            Open cost estimate: <strong>₹{totalOpenCost.toLocaleString()}</strong>
          </div>
        )}
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date Logged</th>
              <th>Vehicle</th>
              <th>Description</th>
              <th>Cost Estimate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const v = vehicles.find(veh => veh.id === m.vehicleId);
              return (
                <tr key={m.id}>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(m.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-accent-light)', fontSize: '0.85rem' }}>{v?.regNumber || '—'}</code>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{v?.name}</div>
                  </td>
                  <td style={{ maxWidth: 280 }}>{m.description}</td>
                  <td style={{ fontWeight: 700 }}>₹{m.cost.toLocaleString()}</td>
                  <td><span className={m.status === 'Open' ? 'badge badge-inshop' : 'badge badge-available'}>{m.status}</span></td>
                  <td>
                    <div className={classes.actionGroup}>
                      {m.status === 'Open' && (
                        <button className={`${classes.actionBtn} ${classes.actionBtnSuccess}`} onClick={() => { if (window.confirm('Close this maintenance record?')) closeMaintenance(m.id); }} title="Close maintenance">
                          <CheckCircle size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6}>
                <div className={classes.emptyState}>
                  <Wrench size={40} className={classes.emptyIcon} />
                  <div className={classes.emptyTitle}>No maintenance records</div>
                  <div className={classes.emptyDesc}>Log a maintenance entry when a vehicle requires service.</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
