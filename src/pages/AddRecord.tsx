import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  ChevronRight,
  Info,
  CheckCircle2,
  Fingerprint,
  RotateCcw,
  User,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { auth } from '../firebase/config';

const AddRecord: React.FC = () => {
  const { addRecord } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    offence: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    location: '',
    officerInCharge: auth.currentUser?.email?.split('@')[0].toUpperCase() || 'OFFICER',
    arrestDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.gender || !formData.offence) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      addRecord({
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        offence: formData.offence,
        priority: formData.priority,
        location: formData.location || 'Central Station',
        officerInCharge: formData.officerInCharge,
        arrestDate: formData.arrestDate
      });
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/records');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="page-container">
      <div className="section-header animate-in">
        <div className="path-indicator">REGISTRATION / NEW_ENTRY</div>
        <h1>Classify New Dossier</h1>
        <p>Digitally secure new suspect identification and offence data into HQ archives</p>
      </div>

      <div className="entry-layout animate-in" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleSubmit} className="entry-form glass">
          <div className="form-section-header">
            <Fingerprint size={24} className="accent-color" />
            <div>
              <h3>Security Identification</h3>
              <p>Authorized entry for certified personnel only</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group full">
              <label><User size={14} /> LEGAL FULL NAME</label>
              <input 
                type="text" placeholder="John Doe" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className="field-group">
              <label>BIOMETRIC AGE</label>
              <input 
                type="number" placeholder="25" 
                value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                required 
              />
            </div>

            <div className="field-group">
              <label>GENDER IDENTITY</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} required>
                <option value="">Select...</option>
                <option value="Male">MALE</option>
                <option value="Female">FEMALE</option>
                <option value="Other">OTHER</option>
              </select>
            </div>

            <div className="field-group">
              <label><AlertCircle size={14} /> THREAT PRIORITY</label>
              <select 
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
                className={`priority-select ${formData.priority.toLowerCase()}`}
              >
                <option value="Low">LOW PRIORITY</option>
                <option value="Medium">MEDIUM PRIORITY</option>
                <option value="High">HIGH PRIORITY</option>
                <option value="Critical">CRITICAL THREAT</option>
              </select>
            </div>

            <div className="field-group">
              <label><MapPin size={14} /> STATION LOCATION</label>
              <input 
                type="text" placeholder="e.g. Precinct IV" 
                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                required 
              />
            </div>

            <div className="field-group full">
              <label>PRIMARY OFFENCE CHARGE</label>
              <input 
                type="text" placeholder="Describe the offence..." 
                value={formData.offence} onChange={e => setFormData({...formData, offence: e.target.value})}
                required 
              />
            </div>

            <div className="field-group">
              <label><Calendar size={14} /> APPREHENSION DATE</label>
              <input 
                type="date" 
                value={formData.arrestDate} onChange={e => setFormData({...formData, arrestDate: e.target.value})}
                required 
              />
            </div>

            <div className="field-group">
              <label>CERTIFIED OFFICER</label>
              <input 
                type="text" value={formData.officerInCharge} readOnly className="readonly"
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="reset" className="ghost-btn" onClick={() => setFormData({...formData, name: '', age: '', offence: ''})}>
              <RotateCcw size={16} /> RESET ENTRY
            </button>
            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
              disabled={isSubmitting || showSuccess}
            >
              {showSuccess ? (
                <><CheckCircle2 size={18} /> DATA SECURED</>
              ) : isSubmitting ? (
                "AUTHENTICATING..."
              ) : (
                <><UserPlus size={18} /> COMMIT TO ARCHIVES <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </form>

        <div className="side-guide">
          <div className="guide-card glass">
            <Info size={20} className="accent-color" />
            <h4>HQ PROTOCOL</h4>
            <p>Ensure all intelligence entered matches validated field reports.</p>
            <ul>
              <li>AES-256 Encrypted</li>
              <li>Logged to Audit Trail</li>
              <li>Visible to Command</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .path-indicator { font-size: 0.65rem; font-weight: 800; color: var(--accent-primary); letter-spacing: 2px; margin-bottom: 1rem; }
        
        .entry-layout { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        .entry-form { padding: 3rem; border-radius: var(--radius-xl); }
        
        .form-section-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3.5rem; padding-bottom: 2rem; border-bottom: 1px solid var(--panel-border); }
        .form-section-header h3 { font-size: 1.15rem; color: white; margin-bottom: 0.25rem; }
        .form-section-header p { font-size: 0.75rem; color: var(--text-muted); }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .field-group.full { grid-column: 1 / -1; }
        
        .field-group label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; gap: 0.5rem; }
        .field-group input, .field-group select { 
          background: rgba(15, 23, 42, 0.4); border: 1px solid var(--panel-border); padding: 1rem 1.25rem; border-radius: var(--radius-md); 
          color: white; font-family: inherit; font-size: 0.95rem; transition: var(--transition-smooth);
        }
        .field-group input:focus, .field-group select:focus { border-color: var(--accent-primary); outline: none; background: rgba(15, 23, 42, 0.6); box-shadow: 0 0 20px rgba(56, 189, 248, 0.05); }
        
        .readonly { opacity: 0.5; background: rgba(255,255,255,0.02) !important; cursor: not-allowed; border-style: dashed !important; }
        
        .priority-select.critical { color: var(--danger); font-weight: 700; border-color: rgba(244,63,94,0.3); }
        .priority-select.high { color: var(--warning); }
        
        .form-footer { margin-top: 4rem; display: flex; justify-content: flex-end; gap: 1.5rem; }
        .ghost-btn { padding: 1rem 1.5rem; color: var(--text-muted); font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; }
        .submit-btn { background: white; color: black; padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.9rem; display: flex; align-items: center; gap: 1rem; transition: var(--transition-smooth); box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
        .submit-btn:hover:not(:disabled) { background: var(--accent-primary); color: white; transform: translateY(-2px); }
        .submit-btn.success { background: var(--success); color: white; }

        .side-guide { display: flex; flex-direction: column; gap: 1.5rem; }
        .guide-card { padding: 2rem; border-radius: var(--radius-xl); }
        .guide-card h4 { font-size: 0.85rem; letter-spacing: 1px; color: white; margin: 1rem 0; }
        .guide-card p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }
        .guide-card ul { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
        .guide-card li { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); display: flex; align-items: center; gap: 0.75rem; }
        .guide-card li::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--accent-primary); }

        .accent-color { color: var(--accent-primary); }

        @media (max-width: 1024px) { .entry-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AddRecord;
