import React, { useMemo, useState } from 'react';
import { Fuel, Wrench, DollarSign, TrendingUp, Search, Receipt } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import classes from './Expenses.module.css';
import listClasses from './List.module.css';

const typeIcon = { Fuel: Fuel, Maintenance: Wrench, Toll: Receipt, Insurance: DollarSign };
const typeColor = { Fuel: '#f97316', Maintenance: '#ef4444', Toll: '#8b5cf6', Insurance: '#06b6d4' };

const Expenses = () => {
  const { expenses, vehicles } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const types = ['All', 'Fuel', 'Maintenance', 'Toll', 'Insurance'];

  const summary = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const fuel = expenses.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0);
    const maint = expenses.filter(e => e.type === 'Maintenance').reduce((s, e) => s + e.amount, 0);
    const other = total - fuel - maint;
    return { total, fuel, maint, other };
  }, [expenses]);

  const chartData = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.type] = (map[e.type] || 0) + e.amount; });
    return Object.entries(map).map(([name, amount]) => ({ name, amount }));
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).filter(e => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'All' || e.type === filterType;
      return matchSearch && matchType;
    });
  }, [expenses, search, filterType]);

  return (
    <div className={classes.page}>
      {/* Summary Cards */}
      <div className={classes.summaryGrid}>
        <SummaryCard title="Total Expenses" value={summary.total} icon={DollarSign} color="#ec4899" />
        <SummaryCard title="Fuel Costs" value={summary.fuel} icon={Fuel} color="#f97316" />
        <SummaryCard title="Maintenance Costs" value={summary.maint} icon={Wrench} color="#ef4444" />
        <SummaryCard title="Other Costs" value={summary.other} icon={TrendingUp} color="#8b5cf6" />
      </div>

      {/* Chart */}
      <div className={`glass-panel ${classes.chartCard}`}>
        <h3 className={classes.chartTitle}>Expense Breakdown by Category</h3>
        <div className={classes.chartBody}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 13 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <RechartsTooltip contentStyle={{ background: '#1a2234', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }} formatter={v => [`₹${v.toLocaleString()}`, 'Amount']} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {chartData.map((entry, i) => <Cell key={i} fill={typeColor[entry.name] || '#6366f1'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className={listClasses.header}>
        <h2>All Expense Records</h2>
      </div>

      <div className={listClasses.toolbar}>
        <div className={listClasses.searchBox}>
          <Search size={15} className={listClasses.searchIcon} />
          <input className={listClasses.searchInput} placeholder="Search by description…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} className={`${listClasses.filterBtn} ${filterType === t ? listClasses.activeFilter : ''}`} onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Vehicle</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const v = vehicles.find(veh => veh.id === e.vehicleId);
              const Icon = typeIcon[e.type] || DollarSign;
              const color = typeColor[e.type] || '#6366f1';
              return (
                <tr key={e.id}>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: `${color}18`, color, fontSize: '0.8rem', fontWeight: 700 }}>
                      <Icon size={13} />{e.type}
                    </span>
                  </td>
                  <td>{e.description}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{v?.regNumber || '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{e.amount.toLocaleString()}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5}>
                <div className={listClasses.emptyState}>
                  <DollarSign size={40} className={listClasses.emptyIcon} />
                  <div className={listClasses.emptyTitle}>No expense records</div>
                  <div className={listClasses.emptyDesc}>Expenses are logged automatically when trips are completed or maintenance is closed.</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
  <div className={`glass-panel ${classes.summaryCard}`}>
    <div className={classes.summaryIcon} style={{ background: `${color}15`, color }}><Icon size={22} /></div>
    <div>
      <p className={classes.summaryLabel}>{title}</p>
      <h3 className={classes.summaryValue}>₹{(value / 1000).toFixed(1)}K</h3>
      <p className={classes.summaryFull}>₹{value.toLocaleString()}</p>
    </div>
  </div>
);

export default Expenses;
