import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Search, 
  LogOut, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings as SettingsIcon,
  Circle
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useSettings } from '../context/SettingsContext';

const Sidebar: React.FC<{ isCollapsed: boolean, setIsCollapsed: (v: boolean) => void }> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Record', path: '/add', icon: <UserPlus size={20} /> },
    { name: 'Records', path: '/records', icon: <Users size={20} /> },
    { name: 'Search', path: '/search', icon: <Search size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <aside className={`sidebar glass ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo">
          <ShieldCheck size={28} className="logo-icon" />
        </div>
        {!isCollapsed && (
          <div className="brand-text">
            <span>GHANA POLICE</span>
            <small>COMMAND SYSTEM</small>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={isCollapsed ? item.name : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout" onClick={handleLogout} title={isCollapsed ? 'Logout' : ''}>
          <span className="nav-icon"><LogOut size={20} /></span>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
        
        <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          border-right: 1px solid var(--panel-border);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar.collapsed {
          width: var(--sidebar-collapsed);
        }

        .sidebar-brand {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .brand-logo {
          min-width: 32px;
          color: var(--accent-primary);
          display: flex;
          justify-content: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
          white-space: nowrap;
        }

        .brand-text span {
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        .brand-text small {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 700;
          margin-top: 4px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .nav-link.active {
          background: rgba(56, 189, 248, 0.1);
          color: var(--accent-primary);
          font-weight: 600;
        }

        .nav-icon {
          min-width: 24px;
          display: flex;
          justify-content: center;
        }

        .nav-label {
          font-size: 0.9rem;
        }

        .sidebar-footer {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
        }

        .logout {
          color: var(--danger) !important;
          background: rgba(244, 63, 94, 0.05);
        }

        .collapse-toggle {
          position: absolute;
          right: -12px;
          top: -20px;
          width: 24px;
          height: 24px;
          background: var(--bg-sidebar);
          border: 1px solid var(--panel-border);
          border-radius: 50%;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .collapse-toggle:hover {
          color: var(--accent-primary);
          transform: scale(1.1);
        }

        .sidebar.collapsed .sidebar-brand { justify-content: center; padding: 2rem 0; }
        .sidebar.collapsed .nav-link { justify-content: center; padding: 0.875rem 0; }
      `}</style>
    </aside>
  );
};

const Topbar: React.FC = () => {
  const { profile } = useSettings();
  return (
    <header className="top-header">
      <div className="top-header-left">
        <div className="system-tag">
          <Circle size={8} fill="currentColor" className="status-dot pulsed" />
          <span>HQ UPLINK STABLE</span>
        </div>
      </div>

      <div className="top-header-right">
        <div className="util-group">
          <button className="util-btn"><Bell size={18} /></button>
          <Link to="/settings" className="util-btn"><SettingsIcon size={18} /></Link>
        </div>
        <div className="divider"></div>
        <div className="user-profile">
          <div className="profile-text">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-role">COMMANDER</span>
          </div>
          <div className="profile-avatar glass">
            {profile.name.charAt(0)}
          </div>
        </div>
      </div>

      <style>{`
        .top-header {
          height: var(--header-height);
          padding: 0 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--panel-border);
          background: rgba(var(--bg-main-rgb), 0.8);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 900;
        }

        .system-tag {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--success);
          letter-spacing: 1px;
          background: rgba(16, 185, 129, 0.05);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }

        .status-dot.pulsed {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .top-header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .util-group {
          display: flex;
          gap: 0.5rem;
        }

        .util-btn {
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
        }

        .util-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }

        .divider {
          width: 1px;
          height: 24px;
          background: var(--panel-border);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-text {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          line-height: 1.2;
        }

        .profile-name {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-primary);
        }

        .profile-role {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: var(--accent-primary);
          background: rgba(56, 189, 248, 0.1);
        }
      `}</style>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`layout-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="grid-overlay"></div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="main-viewport">
        <Topbar />
        <main className="main-content">
          {children}
        </main>
      </div>

      <style>{`
        .layout-wrapper {
          display: flex;
          min-height: 100vh;
        }

        .main-viewport {
          flex: 1;
          margin-left: var(--sidebar-width);
          transition: margin 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-collapsed .main-viewport {
          margin-left: var(--sidebar-collapsed);
        }

        .main-content {
          flex: 1;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default Layout;
