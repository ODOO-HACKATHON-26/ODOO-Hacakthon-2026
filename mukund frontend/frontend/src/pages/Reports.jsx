import React, { useMemo } from 'react';
import { FileDown, BarChart3, TrendingUp, Truck, Users, Route, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import classes from './Reports.module.css';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#64748b'];

const Reports = () => {
  const { vehicles, drivers, trips, expenses } = useAppContext();

  const vehicleStatusData = useMemo(() => [
    { name: 'Available', value: vehicles.filter(v => v.status === 'Available').length },
    { name: 'On Trip', value: vehicles.filter(v => v.status === 'On Trip').length },
    { name: 'In Shop', value: vehicles.filter(v => v.status === 'In Shop').length },
    { name: 'Retired', value: vehicles.filter(v => v.status === 'Retired').length },
  ], [vehicles]);

  const tripStatusData = useMemo(() => [
    { name: 'Completed', value: trips.filter(t => t.status === 'Completed').length },
    { name: 'Dispatched', value: trips.filter(t => t.status === 'Dispatched').length },
    { name: 'Cancelled', value: trips.filter(t => t.status === 'Cancelled').length },
  ], [trips]);

  const expenseByType = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.type] = (map[e.type] || 0) + e.amount; });
    return Object.entries(map).map(([name, amount]) => ({ name, amount }));
  }, [expenses]);

  // Vehicle distance ranking (top 5 by highest odometer)
  const topVehicles = useMemo(() =>
    [...vehicles].sort((a, b) => b.odometer - a.odometer).slice(0, 5).map(v => ({ name: v.regNumber, km: v.odometer }))
  , [vehicles]);

  // Utilization trend mock data (7 days)
  const utilizationTrend = [
    { day: 'Mon', utilization: 55 }, { day: 'Tue', utilization: 62 },
    { day: 'Wed', utilization: 48 }, { day: 'Thu', utilization: 70 },
    { day: 'Fri', utilization: 66 }, { day: 'Sat', utilization: 40 },
    { day: 'Sun', utilization: 30 },
  ];

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalDistance = trips.filter(t => t.distance).reduce((s, t) => s + (t.distance || 0), 0);
  const avgSafetyScore = drivers.length > 0 ? (drivers.reduce((s, d) => s + d.safetyScore, 0) / drivers.length).toFixed(1) : 0;

  return (
    <div className={classes.page}>
      {/* Summary KPIs */}
      <div className={classes.kpiRow}>
        <KpiMini icon={Truck} label="Total Fleet" value={vehicles.length} color="#3b82f6" />
        <KpiMini icon={Route} label="Total Trips" value={trips.length} color="#10b981" />
        <KpiMini icon={Users} label="Avg Safety Score" value={`${avgSafetyScore}/100`} color="#8b5cf6" />
        <KpiMini icon={DollarSign} label="Total Expenses" value={`₹${(totalExpenses/1000).toFixed(1)}K`} color="#ec4899" />
        <KpiMini icon={TrendingUp} label="Total Distance" value={`${totalDistance.toLocaleString()} km`} color="#f59e0b" />
      </div>

      {/* Export Buttons */}
      <div className={classes.exportRow}>
        <h2 className={classes.pageHeading}>Reports & Analytics</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline btn-sm" onClick={() => alert('CSV export — coming soon!')}><FileDown size={15} /> Export CSV</button>
          <button className="btn btn-secondary btn-sm" onClick={() => alert('PDF export — coming soon!')}><FileDown size={15} /> Export PDF</button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className={classes.chartsGrid}>

        {/* Fleet Utilization Trend */}
        <div className={`glass-panel ${classes.chartCard} ${classes.wide}`}>
          <h3 className={classes.chartTitle}>Fleet Utilization Trend (%)</h3>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationTrend}>
                <defs>
                  <linearGradient id="utilGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <RechartsTooltip contentStyle={{ background: '#1a2234', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }} formatter={v => [`${v}%`, 'Utilization']} />
                <Area type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2.5} fill="url(#utilGrad2)" dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6, fill: '#60a5fa' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Status Pie */}
        <div className={`glass-panel ${classes.chartCard}`}>
          <h3 className={classes.chartTitle}>Vehicle Status Distribution</h3>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehicleStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={4} stroke="none" label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''} labelLine={false}>
                  {vehicleStatusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ background: '#1a2234', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Vehicles by Odometer */}
        <div className={`glass-panel ${classes.chartCard}`}>
          <h3 className={classes.chartTitle}>Top Vehicles by Distance (km)</h3>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topVehicles} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" stroke="#5b6b82" tick={{ fill: '#8896ab', fontSize: 11 }} axisLine={false} tickLine={false} width={88} />
                <RechartsTooltip contentStyle={{ background: '#1a2234', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }} formatter={v => [`${v.toLocaleString()} km`, 'Odometer']} />
                <Bar dataKey="km" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className={`glass-panel ${classes.chartCard}`}>
          <h3 className={classes.chartTitle}>Expense by Category (₹)</h3>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#5b6b82" tick={{ fill: '#5b6b82', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <RechartsTooltip contentStyle={{ background: '#1a2234', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9', fontSize: 13 }} formatter={v => [`₹${v.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="#ec4899" radius={[6, 6, 0, 0]} maxBarSize={52} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Status */}
        <div className={`glass-panel ${classes.chartCard}`}>
          <h3 className={classes.chartTitle}>Trip Status Summary</h3>
          <div className={classes.tripStatus}>
            {tripStatusData.map((item, i) => (
              <div key={item.name} className={classes.tripStatusItem}>
                <div className={classes.tripStatusBar}>
                  <div className={classes.tripStatusFill} style={{ width: `${trips.length > 0 ? (item.value / trips.length) * 100 : 0}%`, background: [COLORS[0], COLORS[1], COLORS[2]][i] }} />
                </div>
                <div className={classes.tripStatusInfo}>
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const KpiMini = ({ icon: Icon, label, value, color }) => (
  <div className={`glass-panel ${classes.kpiMini}`}>
    <div className={classes.kpiMiniIcon} style={{ background: `${color}15`, color }}><Icon size={18} /></div>
    <div>
      <p className={classes.kpiMiniLabel}>{label}</p>
      <h4 className={classes.kpiMiniValue}>{value}</h4>
    </div>
  </div>
);

export default Reports;
