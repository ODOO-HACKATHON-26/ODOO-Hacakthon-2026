import React, { useState, useMemo } from 'react';
import { Plus, Search, UserX, Users, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import classes from './List.module.css';

const SafetyRing = ({ score }) => {
  const color = score >= 85 ? 'var(--color-success)' : score >= 70 ? 'var(--color-warning)' : 'var(--color-danger)';
  const r = 16; const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width="40" height="40" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <span style={{ fontSize: '0.875rem', fontWeight: 700, color }}>{score}</span>
    </div>
  );
};

const Drivers = () => {
  const { drivers, addDriver, updateDriverStatus } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({ name: '', licenseNumber: '', category: 'LMV', expiry: '', contact: '' });

  const statuses = ['All', 'Available', 'On Trip', 'Off Duty', 'Suspended'];

  const filtered = useMemo(() => {
    return drivers.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [drivers, search, filterStatus]);

  const isExpired = (date) => new Date(date) < new Date();

  const handleSubmit = (e) => {
    e.preventDefault();
    addDriver({ ...formData, licenseNumber: formData.licenseNumber.toUpperCase(), safetyScore: 100 });
    setShowForm(false);
    setFormData({ name: '', licenseNumber: '', category: 'LMV', expiry: '', contact: '' });
  };

  const getStatusBadge = (s) => ({ Available: 'badge badge-available', 'On Trip': 'badge badge-ontrip', 'Off Duty': 'badge badge-retired', Suspended: 'badge badge-inshop' }[s] || 'badge badge-retired');

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h2>Driver Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Driver'}
        </button>
      </div>

      {showForm && (
        <div className={`glass-panel ${classes.formContainer}`}>
          <h3>Register New Driver</h3>
          <form onSubmit={handleSubmit} className={classes.gridForm}>
            <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" required placeholder="Driver full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">License Number</label><input type="text" className="form-input" required placeholder="e.g. KA12345678" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })} /></div>
            <div className="form-group"><label className="form-label">License Category</label>
              <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {['LMV', 'HMV', 'HPMV', 'Special'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">License Expiry</label><input type="date" className="form-input" required value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Contact Number</label><input type="tel" className="form-input" required placeholder="e.g. 9876543210" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} /></div>
            <div className={classes.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Driver</button>
            </div>
          </form>
        </div>
      )}

      <div className={classes.toolbar}>
        <div className={classes.searchBox}>
          <Search size={15} className={classes.searchIcon} />
          <input className={classes.searchInput} placeholder="Search by name or license…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} className={`${classes.filterBtn} ${filterStatus === s ? classes.activeFilter : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className={classes.tableStats}>
        <div className={classes.tableStat}>Showing <strong>{filtered.length}</strong> of <strong>{drivers.length}</strong> drivers</div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>License #</th>
              <th>Category</th>
              <th>Expiry</th>
              <th>Safety Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const expired = isExpired(d.expiry);
              return (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong></td>
                  <td><code style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{d.licenseNumber}</code></td>
                  <td>
                    <span className="badge badge-info" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.8rem' }}>{d.category}</span>
                  </td>
                  <td>
                    <span style={{ color: expired ? 'var(--color-danger)' : 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}>
                      {expired && <AlertTriangle size={13} />}
                      {d.expiry}
                      {expired && <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: 600 }}>EXPIRED</span>}
                    </span>
                  </td>
                  <td><SafetyRing score={d.safetyScore} /></td>
                  <td><span className={getStatusBadge(d.status)}>{d.status}</span></td>
                  <td>
                    <div className={classes.actionGroup}>
                      {d.status === 'Available' && (
                        <button className={`${classes.actionBtn} ${classes.actionBtnWarning}`} onClick={() => updateDriverStatus(d.id, 'Off Duty')} title="Set Off Duty">
                          <UserX size={14} />
                        </button>
                      )}
                      {d.status === 'Off Duty' && (
                        <button className={`${classes.actionBtn} ${classes.actionBtnSuccess}`} onClick={() => updateDriverStatus(d.id, 'Available')} title="Set On Duty">
                          <Users size={14} />
                        </button>
                      )}
                      {d.status !== 'Suspended' && d.status !== 'On Trip' && (
                        <button className={`${classes.actionBtn} ${classes.actionBtnDanger}`} onClick={() => updateDriverStatus(d.id, 'Suspended')} title="Suspend driver">
                          <UserX size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7}>
                <div className={classes.emptyState}>
                  <Users size={40} className={classes.emptyIcon} />
                  <div className={classes.emptyTitle}>No drivers found</div>
                  <div className={classes.emptyDesc}>Try adjusting your search or filter criteria.</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
