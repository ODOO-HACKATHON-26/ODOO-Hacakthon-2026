import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Save, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import classes from './Settings.module.css';

const Settings = () => {
  const { currentUser, resetAllData } = useAppContext();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, tripAlerts: true, maintenance: true, expiry: false });
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <div className={classes.page}>
      <div className={classes.settingsLayout}>
        {/* Sidebar Tabs */}
        <div className={`glass-panel ${classes.tabsList}`}>
          <p className={classes.tabsHeading}>Settings</p>
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={`${classes.tab} ${activeTab === t.id ? classes.activeTab : ''}`} onClick={() => setActiveTab(t.id)}>
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className={`glass-panel ${classes.panel}`}>

          {activeTab === 'profile' && (
            <section>
              <h3 className={classes.sectionTitle}>Profile Information</h3>
              <p className={classes.sectionDesc}>Manage your personal details and role information.</p>
              <div className={classes.avatarSection}>
                <div className={classes.bigAvatar}>{currentUser?.name?.charAt(0)}</div>
                <div>
                  <p className={classes.avatarName}>{currentUser?.name}</p>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{currentUser?.role}</span>
                </div>
              </div>
              <div className={classes.formGrid}>
                <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" defaultValue={currentUser?.name} /></div>
                <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" defaultValue={currentUser?.email || 'manager@transitops.com'} /></div>
                <div className="form-group"><label className="form-label">Role</label><input type="text" className="form-input" defaultValue={currentUser?.role} disabled style={{ opacity: 0.6 }} /></div>
                <div className="form-group"><label className="form-label">Contact Number</label><input type="tel" className="form-input" placeholder="+91 98765 43210" /></div>
              </div>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}</button>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section>
              <h3 className={classes.sectionTitle}>Notification Preferences</h3>
              <p className={classes.sectionDesc}>Control what alerts you receive from TransitOps.</p>
              <div className={classes.toggleList}>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive daily summary reports via email' },
                  { key: 'tripAlerts', label: 'Trip Alerts', desc: 'Get notified when trips are dispatched or completed' },
                  { key: 'maintenance', label: 'Maintenance Reminders', desc: 'Alerts for upcoming and overdue maintenance' },
                  { key: 'expiry', label: 'License Expiry Warnings', desc: 'Warnings 30 days before license expiry' },
                ].map(item => (
                  <div key={item.key} className={classes.toggleRow}>
                    <div>
                      <p className={classes.toggleLabel}>{item.label}</p>
                      <p className={classes.toggleDesc}>{item.desc}</p>
                    </div>
                    <button
                      className={`${classes.toggle} ${notifications[item.key] ? classes.toggleOn : ''}`}
                      onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                    >
                      <span className={classes.toggleThumb} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleSave}>{saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save</>}</button>
            </section>
          )}

          {activeTab === 'security' && (
            <section>
              <h3 className={classes.sectionTitle}>Security Settings</h3>
              <p className={classes.sectionDesc}>Keep your account safe and secure.</p>
              <div className={classes.formGrid}>
                <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" placeholder="Enter current password" /></div>
                <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" placeholder="Enter new password" /></div>
                <div className="form-group"><label className="form-label">Confirm Password</label><input type="password" className="form-input" placeholder="Re-enter new password" /></div>
              </div>
              <button className="btn btn-primary" onClick={handleSave}>{saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Update Password</>}</button>
            </section>
          )}

          {activeTab === 'appearance' && (
            <section>
              <h3 className={classes.sectionTitle}>Appearance</h3>
              <p className={classes.sectionDesc}>Customize the look and feel of your dashboard.</p>
              <div className={classes.themeGrid}>
                {[
                  { name: 'Dark Navy', primary: '#0a0f1e', accent: '#3b82f6' },
                  { name: 'Deep Space', primary: '#0d0d1a', accent: '#8b5cf6' },
                  { name: 'Emerald', primary: '#0a1a12', accent: '#10b981' },
                  { name: 'Sunset', primary: '#1a0f0a', accent: '#f97316' },
                ].map((theme, i) => (
                  <button key={theme.name} className={`${classes.themeCard} ${i === 0 ? classes.themeActive : ''}`}>
                    <div className={classes.themePreview} style={{ background: theme.primary, borderColor: theme.accent }}>
                      <div style={{ background: theme.accent, width: 20, height: 4, borderRadius: 2 }} />
                    </div>
                    <span>{theme.name}</span>
                    {i === 0 && <span className={classes.themeCheck}><Check size={12} /></span>}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'data' && (
            <section>
              <h3 className={classes.sectionTitle}>Data Management</h3>
              <p className={classes.sectionDesc}>Manage your data, exports, and system resets.</p>
              <div className={classes.dangerZone}>
                <div className={classes.dangerItem}>
                  <div>
                    <p className={classes.dangerLabel}>Export All Data</p>
                    <p className={classes.dangerDesc}>Download all fleet data as a JSON file.</p>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => alert('Export feature — coming soon!')}>Export</button>
                </div>
                <div className={classes.dangerItem}>
                  <div>
                    <p className={classes.dangerLabel} style={{ color: 'var(--color-danger)' }}>Reset Demo Data</p>
                    <p className={classes.dangerDesc}>Restore all data to initial demo values.</p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Reset all data to demo values?')) resetAllData(); }}>Reset</button>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
