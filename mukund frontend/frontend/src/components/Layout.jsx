import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  X,
  Star,
  Cloud,
  MapPinned
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import classes from './Layout.module.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Truck },
  { path: '/drivers', label: 'Drivers', icon: Users },
  { path: '/trips', label: 'Trips', icon: Route },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },

  // ⭐ NEW PAGE
  { path: '/tracking', label: 'Live Tracking', icon: MapPinned },

  { path: '/expenses', label: 'Fuel & Expenses', icon: Fuel },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const pageTitles = {
  '/': 'Dashboard',
  '/vehicles': 'Vehicle Management',
  '/drivers': 'Driver Management',
  '/trips': 'Trip Management',
  '/maintenance': 'Maintenance',

  '/tracking': 'Live Fleet Tracking',

  '/expenses': 'Fuel & Expenses',
  '/reports': 'Reports & Analytics',
  '/settings': 'Settings',
};

const Layout = () => {
  const { currentUser, logout } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };
  const pageTitle = pageTitles[location.pathname] || 'TransitOps';
  const isDark = theme === 'dark';

  return (
    <div className={classes.layout}>
      {mobileOpen && <div className={classes.overlay} onClick={() => setMobileOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`${classes.sidebar} ${collapsed ? classes.collapsed : ''} ${mobileOpen ? classes.mobileOpen : ''}`}>
        <div className={classes.logo}>
          <div className={classes.logoMark}><Truck size={20} /></div>
          {!collapsed && <span className={classes.logoText}>TransitOps</span>}
        </div>

        <nav className={classes.nav}>
          {!collapsed && <p className={classes.navGroup}>MAIN MENU</p>}
          {navItems.slice(0, 6).map(item => (
  <NavItem
    key={item.path}
    item={item}
    collapsed={collapsed}
    onClose={() => setMobileOpen(false)}
  />
))}

{!collapsed && <p className={classes.navGroup}>ANALYTICS</p>}

{navItems.slice(6).map(item => (
  <NavItem
    key={item.path}
    item={item}
    collapsed={collapsed}
    onClose={() => setMobileOpen(false)}
  />
))}
        </nav>

        <div className={classes.sidebarFooter}>
          {!collapsed && (
            <div className={classes.userCard}>
              <div className={classes.avatar}>{currentUser?.name?.charAt(0)}</div>
              <div className={classes.userInfo}>
                <span className={classes.userName}>{currentUser?.name}</span>
                <span className={classes.userRole}>{currentUser?.role}</span>
              </div>
            </div>
          )}
          <button className={classes.logoutBtn} onClick={handleLogout} title="Logout">
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        <button className={classes.collapseBtn} onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
          <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main className={classes.main}>
        <header className={classes.header}>
          <div className={classes.headerLeft}>
            <button className={classes.mobileBtn} onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className={classes.pageTitle}>{pageTitle}</h1>
          </div>

          <div className={classes.headerRight}>
            <button className={classes.iconBtn} title="Search"><Search size={17} /></button>
            <button className={classes.iconBtn} title="Notifications" style={{ position: 'relative' }}>
              <Bell size={17} />
              <span className={classes.notifBadge} />
            </button>

            {/* ✨ 3D ANIMATED THEME SWITCH ✨ */}
            <button
              className={`${classes.themeSwitch} ${isDark ? classes.switchDark : classes.switchLight}`}
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {/* Sky scene background */}
              <div className={classes.switchScene}>
                {/* Stars (visible in dark) */}
                <span className={`${classes.star} ${classes.star1}`}><Star size={4} /></span>
                <span className={`${classes.star} ${classes.star2}`}><Star size={3} /></span>
                <span className={`${classes.star} ${classes.star3}`}><Star size={3} /></span>
                <span className={`${classes.star} ${classes.star4}`}><Star size={4} /></span>
                <span className={`${classes.star} ${classes.star5}`}><Star size={3} /></span>
                {/* Clouds (visible in light) */}
                <span className={`${classes.cloud} ${classes.cloud1}`}><Cloud size={12} /></span>
                <span className={`${classes.cloud} ${classes.cloud2}`}><Cloud size={10} /></span>
              </div>
              {/* The 3D Thumb/Orb */}
              <span className={classes.switchThumb}>
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
              </span>
            </button>

            <div className={classes.headerUser}>
              <div className={classes.headerAvatar}>{currentUser?.name?.charAt(0)}</div>
              <div className={classes.headerUserInfo}>
                <span className={classes.headerUserName}>{currentUser?.name}</span>
                <span className={classes.headerUserRole}>{currentUser?.role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className={classes.content}><Outlet /></div>
      </main>
    </div>
  );
};

const NavItem = ({ item, collapsed, onClose }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => `${classes.navItem} ${isActive ? classes.active : ''}`}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
    >
      <span className={classes.navIcon}><Icon size={19} /></span>
      {!collapsed && <span className={classes.navLabel}>{item.label}</span>}
      {!collapsed && <span className={classes.navIndicator} />}
    </NavLink>
  );
};

export default Layout;
