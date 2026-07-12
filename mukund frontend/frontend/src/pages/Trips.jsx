import React, { useState, useMemo } from 'react';
import { Plus, Search, CheckCircle, XCircle, ShieldAlert, ArrowRight, Navigation } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import classes from './List.module.css';

const Trips = () => {
  const { trips, vehicles, drivers, createTrip, completeTrip, cancelTrip } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [completingTripId, setCompletingTripId] = useState(null);
  const [finalOdometer, setFinalOdometer] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [formData, setFormData] = useState({ source: '', destination: '', vehicleId: '', driverId: '', weight: '', distance: '' });

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');
  const statuses = ['All', 'Dispatched', 'Completed', 'Cancelled'];

  const filtered = useMemo(() => {
    return trips.slice().reverse().filter(t => {
      const v = vehicles.find(veh => veh.id === t.vehicleId);
      const d = drivers.find(drv => drv.id === t.driverId);
      const matchSearch = t.source.toLowerCase().includes(search.toLowerCase()) ||
        t.destination.toLowerCase().includes(search.toLowerCase()) ||
        (v?.regNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (d?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'All' || t.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [trips, search, filterStatus, vehicles, drivers]);

  const handleDispatch = (e) => {
    e.preventDefault();
    setError('');
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    const driver = drivers.find(d => d.id === formData.driverId);
    const weight = Number(formData.weight);
    if (!vehicle || !driver) { setError('Please select a valid vehicle and driver.'); return; }
    if (weight > vehicle.capacity) { setError(`Cargo weight (${weight}kg) exceeds vehicle capacity (${vehicle.capacity}kg).`); return; }
    if (new Date(driver.expiry) < new Date()) { setError('Selected driver has an expired license.'); return; }
    createTrip({ ...formData, weight, distance: Number(formData.distance) });
    setShowForm(false);
    setFormData({ source: '', destination: '', vehicleId: '', driverId: '', weight: '', distance: '' });
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    completeTrip(completingTripId, Number(finalOdometer), Number(fuelConsumed));
    setCompletingTripId(null); setFinalOdometer(''); setFuelConsumed('');
  };

  const getStatusBadge = (s) => ({ Completed: 'badge badge-available', Dispatched: 'badge badge-ontrip', Cancelled: 'badge badge-inshop' }[s] || 'badge badge-retired');

  return (
    <div className={classes.pageContainer}>
      <div className={classes.header}>
        <h2>Trip Management</h2>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); }}>
          <Navigation size={16} /> {showForm ? 'Cancel' : 'Dispatch Trip'}
        </button>
      </div>

      {showForm && (
        <div className={`glass-panel ${classes.formContainer}`}>
          <h3>Dispatch New Trip</h3>
          {error && <div className={classes.errorMsg}><ShieldAlert size={14} />{error}</div>}
          <form onSubmit={handleDispatch} className={classes.gridForm}>
            <div className="form-group"><label className="form-label">Origin</label><input type="text" className="form-input" required placeholder="e.g. Delhi" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Destination</label><input type="text" className="form-input" required placeholder="e.g. Mumbai" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Assign Vehicle</label>
              <select className="form-select" required value={formData.vehicleId} onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}>
                <option value="" disabled>Select a vehicle</option>
                {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber} — {v.name} (Max: {v.capacity.toLocaleString()}kg)</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Assign Driver</label>
              <select className="form-select" required value={formData.driverId} onChange={e => setFormData({ ...formData, driverId: e.target.value })}>
                <option value="" disabled>Select a driver</option>
                {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.category}) — Exp: {d.expiry}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Cargo Weight (kg)</label><input type="number" min="1" className="form-input" required placeholder="e.g. 5000" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Planned Distance (km)</label><input type="number" min="1" className="form-input" required placeholder="e.g. 1400" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} /></div>
            <div className={classes.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary"><Navigation size={15} /> Dispatch</button>
            </div>
          </form>
        </div>
      )}

      {completingTripId && (
        <div className={`glass-panel ${classes.formContainer}`}>
          <h3>Complete Trip</h3>
          <div className={classes.infoText}><ShieldAlert size={14} style={{ color: 'var(--color-warning)' }} /> Enter final readings to complete the trip and update vehicle odometer.</div>
          <form onSubmit={handleCompleteSubmit} className={classes.gridForm}>
            <div className="form-group"><label className="form-label">Final Odometer (km)</label><input type="number" min="0" className="form-input" required placeholder="Current odometer reading" value={finalOdometer} onChange={e => setFinalOdometer(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Fuel Consumed (Litres)</label><input type="number" min="0" step="0.1" className="form-input" required placeholder="Total litres used" value={fuelConsumed} onChange={e => setFuelConsumed(e.target.value)} /></div>
            <div className={classes.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setCompletingTripId(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary"><CheckCircle size={15} /> Mark Complete</button>
            </div>
          </form>
        </div>
      )}

      <div className={classes.toolbar}>
        <div className={classes.searchBox}>
          <Search size={15} className={classes.searchIcon} />
          <input className={classes.searchInput} placeholder="Search by route, vehicle, driver…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} className={`${classes.filterBtn} ${filterStatus === s ? classes.activeFilter : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      <div className={classes.tableStats}>
        <div className={classes.tableStat}>Showing <strong>{filtered.length}</strong> of <strong>{trips.length}</strong> trips</div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Cargo</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const v = vehicles.find(veh => veh.id === t.vehicleId);
              const d = drivers.find(drv => drv.id === t.driverId);
              return (
                <tr key={t.id}>
                  <td><code style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent-light)' }}>#{t.id.slice(-4).toUpperCase()}</code></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 600 }}>{t.source}</span>
                      <ArrowRight size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{t.destination}</span>
                    </div>
                    {t.distance && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{t.distance} km</div>}
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{v?.regNumber || '—'}</td>
                  <td style={{ fontSize: '0.875rem' }}>{d?.name || '—'}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{t.weight?.toLocaleString()} kg</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td><span className={getStatusBadge(t.status)}>{t.status}</span></td>
                  <td>
                    <div className={classes.actionGroup}>
                      {t.status === 'Dispatched' && (
                        <>
                          <button className={`${classes.actionBtn} ${classes.actionBtnSuccess}`} onClick={() => setCompletingTripId(t.id)} title="Complete trip"><CheckCircle size={15} /></button>
                          <button className={`${classes.actionBtn} ${classes.actionBtnDanger}`} onClick={() => { if (window.confirm('Cancel this trip?')) cancelTrip(t.id); }} title="Cancel trip"><XCircle size={15} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8}>
                <div className={classes.emptyState}>
                  <Navigation size={40} className={classes.emptyIcon} />
                  <div className={classes.emptyTitle}>No trips found</div>
                  <div className={classes.emptyDesc}>Dispatch a new trip or adjust your filter.</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
