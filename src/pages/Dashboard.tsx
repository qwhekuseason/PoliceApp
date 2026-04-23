import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  CircleAlert, 
  Activity, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Plus,
  Terminal,
  Search,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricCard: React.FC<{ 
  label: string, 
  value: string | number, 
  icon: React.ReactNode, 
  color: string,
  trend?: string 
}> = ({ label, value, icon, color, trend }) => (
  <div className="metric-card glass animate-in">
    <div className="card-top">
      <div className="icon-wrapper" style={{ color: color, background: `${color}10` }}>
        {icon}
      </div>
      {trend && (
        <div className="trend-badge">
          <ArrowUpRight size={12} /> {trend}
        </div>
      )}
    </div>
    <div className="card-bottom">
      <h3 className="m-value">{value}</h3>
      <span className="m-label">{label}</span>
    </div>
    <style>{`
      .metric-card {
        padding: 1.5rem;
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        gap: 2rem;
        transition: var(--transition-smooth);
      }
      .metric-card:hover {
        transform: translateY(-4px);
        border-color: var(--accent-primary);
      }
      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .icon-wrapper {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .trend-badge {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--success);
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 100px;
      }
      .m-value {
        font-size: 2rem;
        font-weight: 800;
        color: white;
        margin-bottom: 0.25rem;
      }
      .m-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    `}</style>
  </div>
);

const Dashboard: React.FC = () => {
  const { records, auditLogs, isLoading } = useData();
  const [activeTab, setActiveTab] = React.useState<'records' | 'logs'>('records');

  const total = records.length;
  const critical = records.filter(r => r.priority === 'Critical').length;

  const recentRecords = [...records].slice(0, 5);
  const recentLogs = [...auditLogs].slice(0, 10);

  if (isLoading) {
    return (
      <div className="page-container loading-state">
        <Activity className="spinner" size={32} />
        <span>Synchronizing with Command Center...</span>
        <style>{`
          .loading-state { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--accent-primary); }
          .spinner { animation: rotate 2s linear infinite; }
          @keyframes rotate { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header animate-in">
        <div className="header-flex">
          <div>
            <h1>Command Intelligence</h1>
            <p>Real-time oversight of operative surveillance and archives</p>
          </div>
          <Link to="/add" className="cta-btn">
            <Plus size={18} /> NEW REGISTRATION
          </Link>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Total Files" value={total} icon={<Users size={22} />} color="#38bdf8" trend="+12%" />
        <MetricCard label="Critical Threats" value={critical} icon={<CircleAlert size={22} />} color="#f43f5e" />
        <MetricCard label="Active Uplinks" value="2" icon={<Activity size={22} />} color="#10b981" />
        <MetricCard label="System Security" value="v4.2" icon={<ShieldCheck size={22} />} color="#818cf8" />
      </div>

      <div className="dashboard-content">
        <div className="main-panel glass animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="panel-tabs">
            <button className={`p-tab ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
              <Clock size={16} /> RECENT ENTRIES
            </button>
            <button className={`p-tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
              <Terminal size={16} /> AUDIT LOGS
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'records' ? (
              <div className="scroll-list">
                {recentRecords.length === 0 ? (
                  <div className="empty-state">No records registered.</div>
                ) : (
                  recentRecords.map(r => (
                    <div key={r.id} className="list-item">
                      <div className="item-start">
                        <div className="avatar-small">{r.name.charAt(0)}</div>
                        <div className="item-meta">
                          <span className="record-name">{r.name}</span>
                          <span className="record-id">UID_{r.id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="item-end">
                        <span className={`p-badge ${r.priority.toLowerCase()}`}>{r.priority}</span>
                        <span className="record-date">{r.arrestDate}</span>
                      </div>
                    </div>
                  ))
                )}
                <Link to="/records" className="view-more">VIEW ALL ARCHIVES <ChevronRight size={14} /></Link>
              </div>
            ) : (
              <div className="scroll-list logs">
                {recentLogs.map(l => (
                  <div key={l.id} className="log-item">
                    <span className={`log-action ${l.action.toLowerCase()}`}>{l.action}</span>
                    <p className="log-msg">
                      <strong>{l.officerEmail.split('@')[0]}</strong> {l.action === 'CREATE' ? 'registered' : 'purged'} <strong>{l.entityName}</strong>
                    </p>
                    <span className="log-time">{new Date(l.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="side-panel">
          <div className="info-box glass animate-in" style={{ animationDelay: '0.2s' }}>
            <h4>QUICK FILTER</h4>
            <div className="search-mini">
              <Search size={16} />
              <input type="text" placeholder="Search ID..." />
            </div>
          </div>
          <div className="info-box glass animate-in status-box" style={{ animationDelay: '0.3s' }}>
            <div className="status-header">
              <div className="status-p"></div>
              <h4>SYSTEM INTEGRITY</h4>
            </div>
            <p>Global encrypted uplink is active. All terminal actions are logged under Protocol GH-24.</p>
          </div>
        </div>
      </div>

      <style>{`
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .cta-btn {
          background: white;
          color: black;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: var(--transition-smooth);
        }

        .cta-btn:hover {
          background: var(--accent-primary);
          color: white;
          transform: translateY(-2px);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
        }

        .main-panel {
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-tabs {
          display: flex;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--panel-border);
          padding: 0 1rem;
        }

        .p-tab {
          padding: 1.25rem 1.5rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }

        .p-tab.active {
          color: var(--accent-primary);
        }

        .p-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-primary);
          box-shadow: 0 0 10px var(--accent-primary);
        }

        .scroll-list {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          transition: var(--transition-smooth);
        }

        .list-item:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .item-start { display: flex; align-items: center; gap: 1rem; }
        .avatar-small {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(56, 189, 248, 0.1); color: var(--accent-primary);
          display: flex; align-items: center; justify-content: center; font-weight: 800;
        }

        .item-meta { display: flex; flex-direction: column; }
        .record-name { font-weight: 700; font-size: 0.95rem; }
        .record-id { font-size: 0.7rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

        .item-end { display: flex; align-items: center; gap: 1.5rem; }
        .p-badge { font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid transparent; }
        .p-badge.critical { background: rgba(244, 63, 94, 0.1); color: var(--danger); border-color: rgba(244, 63, 94, 0.2); }
        .p-badge.high { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .p-badge.medium { background: rgba(56, 189, 248, 0.1); color: var(--accent-primary); }
        .p-badge.low { background: rgba(16, 185, 129, 0.1); color: var(--success); }

        .record-date { font-size: 0.75rem; color: var(--text-muted); min-width: 80px; text-align: right; }

        .view-more {
          text-align: center; padding: 1.5rem; font-size: 0.75rem; font-weight: 800; color: var(--accent-primary);
          display: flex; justify-content: center; align-items: center; gap: 0.5rem;
        }

        .log-item {
          display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.25rem;
          font-size: 0.85rem; color: var(--text-secondary);
        }
        .log-action { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; min-width: 60px; text-align: center; }
        .log-action.create { background: rgba(56, 189, 248, 0.1); color: var(--accent-primary); }
        .log-action.delete { background: rgba(244, 63, 94, 0.1); color: var(--danger); }
        .log-msg { flex: 1; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
        .log-time { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--text-muted); }

        .side-panel { display: flex; flex-direction: column; gap: 1.5rem; }
        .info-box { padding: 1.5rem; border-radius: var(--radius-lg); }
        .info-box h4 { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); margin-bottom: 1.25rem; letter-spacing: 1px; }

        .search-mini {
          background: rgba(0,0,0,0.2); border: 1px solid var(--panel-border);
          border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
        }
        .search-mini input { background: transparent; border: none; color: white; width: 100%; font-size: 0.9rem; }
        .search-mini input:focus { outline: none; }

        .status-box p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; }
        .status-header { display: flex; align-items: center; gap: 0.75rem; }
        .status-p { width: 8px; height: 8px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px var(--success); }

        @media (max-width: 1200px) { .dashboard-content { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Dashboard;
