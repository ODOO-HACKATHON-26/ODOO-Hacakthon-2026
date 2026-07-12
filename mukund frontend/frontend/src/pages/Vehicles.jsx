import React, { useState, useMemo } from 'react';
import { Plus, Search, Truck, ShieldAlert, ArchiveX, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import classes from './List.module.css';

const Vehicles = () => {
  const { vehicles, addVehicle, updateVehicleStatus } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({ regNumber: '', name: '', type: 'Truck', capacity: '', odometer: '', cost: '' });
  const [error, setError] = useState('');

  const statuses = ['All', 'Available', 'On Trip', 'In Shop', 'Retired'];

  const filtered = useMemo(() => {
    return vehicles.filter(v => {
      const matchSearch = v.regNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.type.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || v.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [vehicles, search, filterStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (vehicles.some(v => v.regNumber === formData.regNumber.toUpperCase())) {
      setError('Registration number already exists.');
      return;
    }
    addVehicle({ ...formData, regNumber: formData.regNumber.toUpperCase(), capacity: Number(formData.capacity), odometer: Number(formData.odometer), cost: Number(formData.cost) });
    setShowForm(false);
    setFormData({ regNumber: '', name: '', type: 'Truck', capacity: '', odometer: '', cost: '' });
  };

  const handleRetire = (id) => {
    if (window.confirm('Retire this vehicle? This cannot be undone.')) updateVehicleStatus(id, 'Retired');
  };

  const getStatusBadge = (s) => ({ Available: 'badge badge-available', 'On Trip': 'badge badge-ontrip', 'In Shop': 'badge badge-inshop', Retired: 'badge badge-retired' }[s] || 'badge badge-retired');

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h2>Vehicle Registry</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); }}>
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className={`glass-panel ${classes.formContainer}`}>
          <h3>Register New Vehicle</h3>
          {error && <div className={classes.errorMsg}><ShieldAlert size={14} />{error}</div>}
          <form onSubmit={handleSubmit} className={classes.gridForm}>
            <div className="form-group"><label className="form-label">Registration Number</label><input type="text" className="form-input" required placeholder="e.g. KA01AB1234" value={formData.regNumber} onChange={e => setFormData({ ...formData, regNumber: e.target.value.toUpperCase() })} /></div>
            <div className="form-group"><label className="form-label">Vehicle Name / Model</label><input type="text" className="form-input" required placeholder="e.g. Tata 407" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Vehicle Type</label>
              <select className="form-select" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                {['Truck', 'Heavy Truck', 'Mini Truck', 'Van', 'SUV', 'Pickup', 'Car'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Max Capacity (kg)</label><input type="number" min="1" className="form-input" required placeholder="e.g. 5000" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Current Odometer (km)</label><input type="number" min="0" className="form-input" required placeholder="e.g. 45000" value={formData.odometer} onChange={e => setFormData({ ...formData, odometer: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Acquisition Cost (₹)</label><input type="number" min="0" className="form-input" required placeholder="e.g. 850000" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} /></div>
            <div className={classes.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Vehicle</button>
            </div>
          </form>
        </div>
      )}

      <div className={classes.toolbar}>
        <div className={classes.searchBox}>
          <Search size={15} className={classes.searchIcon} />
          <input className={classes.searchInput} placeholder="Search by reg, model, type…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} className={`${classes.filterBtn} ${filterStatus === s ? classes.activeFilter : ''}`} onClick={() => setFilterStatus(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className={classes.tableStats}>
        <div className={classes.tableStat}>Showing <strong>{filtered.length}</strong> of <strong>{vehicles.length}</strong> vehicles</div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Reg. Number</th>
              <th>Vehicle Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Odometer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td><code style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-accent-light)', letterSpacing: '0.04em' }}>{v.regNumber}</code></td>
                <td><strong>{v.name}</strong></td>
                <td style={{ color: 'var(--color-text-secondary)' }}>{v.type}</td>
                <td>{v.capacity.toLocaleString()} kg</td>
                <td>{v.odometer.toLocaleString()} km</td>
                <td><span className={getStatusBadge(v.status)}>{v.status}</span></td>
                <td>
                  <div className={classes.actionGroup}>
                    {v.status !== 'Retired' && (
                      <button className={`${classes.actionBtn} ${classes.actionBtnDanger}`} onClick={() => handleRetire(v.id)} title="Retire vehicle">
                        <ArchiveX size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7}>
                <div className={classes.emptyState}>
                  <Truck size={40} className={classes.emptyIcon} />
                  <div className={classes.emptyTitle}>No vehicles found</div>
                  <div className={classes.emptyDesc}>Try adjusting your search or filter, or add a new vehicle.</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;
