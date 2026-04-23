import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Moon, 
  Sun, 
  Monitor, 
  User, 
  MapPin, 
  BadgeCheck, 
  Bell, 
  Shield, 
  Save,
  Palette,
  Activity
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme, profile, updateProfile } = useSettings();
  const [formData, setFormData] = React.useState(profile);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const themes = [
    { id: 'dark', name: 'Platinum Dark', icon: <Moon size={18} /> },
    { id: 'light', name: 'Ghost Light', icon: <Sun size={18} /> },
    { id: 'amoled', name: 'Amoled Black', icon: <Monitor size={18} /> },
  ];

  return (
    <div className="page-container">
      <div className="section-header animate-in">
        <h1>Command Settings</h1>
        <p>Configure your terminal identity and operational appearance</p>
      </div>

      <div className="settings-grid animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="settings-main">
          {/* Appearance Section */}
          <section className="settings-section glass">
            <div className="section-title">
              <Palette size={20} className="accent-color" />
              <h3>Visual Interface</h3>
            </div>
            <div className="theme-selector">
              {themes.map(t => (
                <button 
                  key={t.id}
                  className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id as any)}
                >
                  <div className="t-icon">{t.icon}</div>
                  <span>{t.name}</span>
                  {theme === t.id && <div className="active-dot" />}
                </button>
              ))}
            </div>
          </section>

          {/* Profile Section */}
          <form onSubmit={handleSave} className="settings-section glass profile-form">
            <div className="section-title">
              <User size={20} className="accent-color" />
              <h3>Officer Identity</h3>
            </div>
            
            <div className="form-rows">
              <div className="form-group">
                <label><BadgeCheck size={14} /> OFFICER NAME</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label><MapPin size={14} /> ASSIGNED PRECINCT</label>
                <input 
                  type="text" 
                  value={formData.station}
                  onChange={e => setFormData({...formData, station: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>BADGE NUMBER</label>
                <input 
                  type="text" 
                  value={formData.badgeNumber}
                  onChange={e => setFormData({...formData, badgeNumber: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className={`save-btn ${isSaved ? 'saved' : ''}`}>
               {isSaved ? 'CONFIG UPDATED' : <><Save size={18} /> SAVE CHANGES</>}
            </button>
          </form>
        </div>

        <div className="settings-sidebar">
          <div className="status-card glass">
             <Shield size={24} className="accent-color" />
             <h4>SYSTEM COMPLIANCE</h4>
             <p>Your session is encrypted with Level 4 protocols. Changes to identity are logged to global audit trails.</p>
             <div className="compliance-list">
               <div className="c-item"><Bell size={14} /> Notifications: ON</div>
               <div className="c-item"><Activity size={14} /> Link: SECURE</div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
        .settings-main { display: flex; flex-direction: column; gap: 2rem; }
        
        .settings-section { padding: 2.5rem; border-radius: var(--radius-xl); }
        .section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .section-title h3 { font-size: 1.1rem; color: var(--text-primary); }

        .theme-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .theme-btn { 
          padding: 2rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--panel-border);
          background: rgba(255,255,255,0.02); display: flex; flex-direction: column; align-items: center; gap: 1rem;
          position: relative; transition: var(--transition-smooth); color: var(--text-secondary);
        }
        .theme-btn:hover { border-color: var(--accent-primary); background: rgba(56, 189, 248, 0.05); }
        .theme-btn.active { border-color: var(--accent-primary); color: white; background: rgba(56, 189, 248, 0.1); }
        .t-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: var(--accent-primary); }
        .theme-btn span { font-size: 0.8rem; font-weight: 700; }
        .active-dot { position: absolute; top: 12px; right: 12px; width: 8px; height: 8px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 10px var(--accent-primary); }

        .form-rows { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 3rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem; }
        .form-group input { 
          background: rgba(0,0,0,0.2); border: 1px solid var(--panel-border); padding: 1rem 1.25rem; border-radius: var(--radius-md); 
          color: var(--text-primary); font-size: 1rem; font-weight: 600;
        }
        .form-group input:focus { outline: none; border-color: var(--accent-primary); background: rgba(0,0,0,0.3); }

        .save-btn { background: white; color: black; padding: 1.1rem 2.5rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; gap: 1rem; margin-left: auto; }
        .save-btn:hover { background: var(--accent-primary); color: white; transform: translateY(-2px); }
        .save-btn.saved { background: var(--success); color: white; }

        .status-card { padding: 2.5rem; border-radius: var(--radius-xl); height: fit-content; }
        .status-card h4 { font-size: 0.85rem; letter-spacing: 1px; margin: 1.5rem 0 0.75rem; color: var(--text-primary); }
        .status-card p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }
        .compliance-list { display: flex; flex-direction: column; gap: 1rem; }
        .c-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); }
        .accent-color { color: var(--accent-primary); }

        @media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Settings;
