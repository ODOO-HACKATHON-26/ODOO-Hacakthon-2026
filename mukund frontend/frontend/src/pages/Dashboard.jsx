import React, { useMemo, useState, useEffect } from 'react';
import {
  Truck, Users, Route, Wrench, Activity, TrendingUp, TrendingDown,
  Fuel, DollarSign, ArrowRight, Clock, CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import classes from './Dashboard.module.css';

// Smooth count-up hook with ease-out cubic
const useCountUp = (target, duration = 1400) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const num = typeof target === 'string' ? parseFloat(target) : target;
    if (isNaN(num) || num === 0) { setCount(0); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quartic
      setCount(Math.round(eased * num * 10) / 10);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return count;
};

// Theme-aware chart colors
const DONUT_COLORS_DARK  = ['#10b981', '#f59e0b', '#f87171', '#475569'];
const DONUT_COLORS_LIGHT = ['#059669', '#d97706', '#dc2626', '#64748b'];

const Dashboard = () => {
  const { vehicles, drivers, trips, expenses } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const DONUT_COLORS = isDark ? DONUT_COLORS_DARK : DONUT_COLORS_LIGHT;
  const accentColor   = isDark ? '#0ea5e9' : '#0284c7';
  const accentGlow    = isDark ? 'rgba(14,165,233,0.3)' : 'rgba(2,132,199,0.2)';
  const gridColor     = isDark ? 'rgba(14,165,233,0.05)' : 'rgba(15,23,42,0.04)';
  const tickColor     = isDark ? '#475569' : '#94a3b8';
  const tooltipBg     = isDark ? '#111d35' : '#0f172a';
  const barGradStart  = isDark ? '#0ea5e9' : '#0284c7';
  const barGradEnd    = isDark ? '#8b5cf6' : '#7c3aed';

  const kpis = useMemo(() => {
    const totalVehicles = vehicles.length;
    const available = vehicles.filter(v => v.status === 'Available').length;
    const inShop = vehicles.filter(v => v.status === 'In Shop').length;
    const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
    const retired = vehicles.filter(v => v.status === 'Retired').length;
    const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
    const completedTrips = trips.filter(t => t.status === 'Completed').length;
    const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;
    const totalDrivers = drivers.length;
    const actionable = totalVehicles - retired - inShop;
    const utilization = actionable > 0 ? ((onTrip / actionable) * 100).toFixed(1) : 0;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const fuelTotal = expenses.filter(e => e.type === 'Fuel').reduce((s, e) => s + e.amount, 0);
    return { totalVehicles, available, inShop, onTrip, retired, activeTrips, completedTrips, driversOnDuty, totalDrivers, utilization, totalExpenses, fuelTotal };
  }, [vehicles, drivers, trips, expenses]);

  const donutData = useMemo(() => [
    { name: 'Available', value: kpis.available },
    { name: 'On Trip', value: kpis.onTrip },
    { name: 'In Shop', value: kpis.inShop },
    { name: 'Retired', value: kpis.retired },
  ], [kpis]);

  const utilizationTrend = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d, i) => ({
      day: d,
      utilization: Math.min(100, Math.max(20, Number(kpis.utilization) + (Math.sin(i * 1.2) * 18))).toFixed(1)
    }));
  }, [kpis.utilization]);

  const expenseBreakdown = useMemo(() => {
    const types = {};
    expenses.forEach(e => { types[e.type] = (types[e.type] || 0) + e.amount; });
    return Object.entries(types).map(([name, amount]) => ({ name, amount }));
  }, [expenses]);

  const recentTrips = useMemo(() => trips.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [trips]);

  const tooltipStyle = {
    background: tooltipBg,
    border: `1px solid ${isDark ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: '#f1f5f9', fontSize: 13,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
  };

  return (
    <div className={classes.dashboard}>
      {/* Ambient background orbs */}
      <div className={classes.bgOrb1} />
      <div className={classes.bgOrb2} />
      <div className={classes.bgOrb3} />

      {/* KPI Row 1 */}
      <div className={classes.kpiGrid}>
        <KpiCard title="Active Vehicles"   value={kpis.totalVehicles}    subtitle={`${kpis.onTrip} on trip`}           icon={Truck}         color="#0ea5e9" delay={0} />
        <KpiCard title="Available"         value={kpis.available}         subtitle="Ready for dispatch"                  icon={CheckCircle2}  color="#10b981" delay={1} />
        <KpiCard title="In Maintenance"    value={kpis.inShop}            subtitle="Under repair"                        icon={Wrench}        color="#f87171" delay={2} trend={-2} />
        <KpiCard title="Active Trips"      value={kpis.activeTrips}       subtitle={`${kpis.completedTrips} completed`}  icon={Route}         color="#f59e0b" delay={3} />
      </div>

      {/* KPI Row 2 */}
      <div className={classes.kpiGrid}>
        <KpiCard title="Drivers On Duty"   value={kpis.driversOnDuty}     subtitle={`of ${kpis.totalDrivers} total`}     icon={Users}         color="#8b5cf6" delay={4} />
        <KpiCard title="Fleet Utilization" value={`${kpis.utilization}%`} subtitle="Active vs available"                 icon={Activity}      color="#06b6d4" delay={5} trend={+3.2} />
        <KpiCard title="Fuel Expenses"     value={`₹${(kpis.fuelTotal/1000).toFixed(1)}K`} subtitle="This period"         icon={Fuel}          color="#fb923c" delay={6} />
        <KpiCard title="Total Expenses"    value={`₹${(kpis.totalExpenses/1000).toFixed(1)}K`} subtitle="All categories"  icon={DollarSign}    color="#ec4899" delay={7} trend={-1.5} />
      </div>

      {/* Charts Row */}
      <div className={classes.chartsGrid}>
        <div className={`glass-panel ${classes.chartCard}`}>
          <div className={classes.chartHeader}>
            <h3 className={classes.chartTitle}>Fleet Utilization</h3>
            <span className={classes.chartBadge}>Last 7 Days</span>
          </div>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationTrend}>
                <defs>
                  <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={accentColor} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day"         stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis                        stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <RechartsTooltip contentStyle={tooltipStyle} formatter={v => [`${v}%`, 'Utilization']} />
                <Area type="monotone" dataKey="utilization"
                  stroke={accentColor} strokeWidth={2.5} fill="url(#utilGrad)"
                  dot={{ r: 4, fill: accentColor, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: accentColor, stroke: '#fff', strokeWidth: 2, filter: 'url(#glow)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`glass-panel ${classes.chartCard}`}>
          <div className={classes.chartHeader}>
            <h3 className={classes.chartTitle}>Vehicle Status</h3>
          </div>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={5} dataKey="value" stroke="none" animationBegin={400} animationDuration={800}>
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={classes.donutLegend}>
            {donutData.map((item, i) => (
              <div key={item.name} className={classes.legendItem}>
                <span className={classes.legendDot} style={{ background: DONUT_COLORS[i], boxShadow: `0 0 8px ${DONUT_COLORS[i]}` }} />
                <span className={classes.legendLabel}>{item.name}</span>
                <span className={classes.legendValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className={classes.bottomGrid}>
        <div className={`glass-panel ${classes.recentCard}`}>
          <div className={classes.chartHeader}>
            <h3 className={classes.chartTitle}>Recent Trips</h3>
            <a href="/trips" className={classes.viewAll}>View all <ArrowRight size={14} /></a>
          </div>
          <div className={classes.tripList}>
            {recentTrips.map((t, i) => (
              <RecentTripItem key={t.id} trip={t} vehicles={vehicles} drivers={drivers} index={i} />
            ))}
          </div>
        </div>

        <div className={`glass-panel ${classes.chartCard}`}>
          <div className={classes.chartHeader}>
            <h3 className={classes.chartTitle}>Expense Breakdown</h3>
          </div>
          <div className={classes.chartBody}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseBreakdown} barGap={8}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={barGradStart} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={barGradEnd}   stopOpacity={0.65} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke={tickColor} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <RechartsTooltip contentStyle={tooltipStyle} formatter={v => [`₹${v.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="amount" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={52} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, subtitle, icon: Icon, color, trend, delay = 0 }) => {
  const displayValue = typeof value === 'number' ? useCountUp(value) : value;
  return (
    <div
      className={`glass-panel ${classes.kpiCard}`}
      style={{ animationDelay: `${delay * 0.08}s` }}
    >
      <div className={classes.kpiTop}>
        <div>
          <p className={classes.kpiTitle}>{title}</p>
          <h2 className={classes.kpiValue}>
            {typeof value === 'number' ? Math.round(displayValue) : displayValue}
          </h2>
        </div>
        <div className={classes.kpiIcon} style={{ background: `${color}18`, color, boxShadow: `0 0 20px ${color}30, inset 0 1px 0 rgba(255,255,255,0.08)` }}>
          <Icon size={22} />
        </div>
      </div>
      <div className={classes.kpiBottom}>
        <span className={classes.kpiSubtitle}>{subtitle}</span>
        {trend !== undefined && (
          <span className={`${classes.kpiTrend} ${trend >= 0 ? classes.trendUp : classes.trendDown}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      {/* Accent line on bottom */}
      <div className={classes.kpiAccentLine} style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
  );
};

const RecentTripItem = ({ trip, vehicles, drivers, index }) => {
  const v = vehicles.find(veh => veh.id === trip.vehicleId);
  const statusClass = {
    Dispatched: 'badge badge-ontrip',
    Completed:  'badge badge-available',
    Cancelled:  'badge badge-inshop'
  }[trip.status] || 'badge badge-retired';

  return (
    <div className={classes.tripItem} style={{ animationDelay: `${index * 0.07}s` }}>
      <div className={classes.tripRoute}>
        <span className={classes.tripCity}>{trip.source}</span>
        <ArrowRight size={13} className={classes.tripArrow} />
        <span className={classes.tripCity}>{trip.destination}</span>
      </div>
      <div className={classes.tripMeta}>
        <span className={classes.tripDetail}><Truck size={11} /> {v?.regNumber || '—'}</span>
        <span className={classes.tripDetail}><Clock size={11} /> {new Date(trip.date).toLocaleDateString()}</span>
      </div>
      <span className={statusClass}>{trip.status}</span>
    </div>
  );
};

export default Dashboard;
