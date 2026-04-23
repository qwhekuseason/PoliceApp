import React, { useState } from 'react';
import { useData, type SuspectRecord } from '../context/DataContext';
import { 
  Search, 
  Filter, 
  Trash2, 
  ShieldAlert,
  ArrowLeft,
  Download,
  ShieldCheck
} from 'lucide-react';

const Records: React.FC = () => {
  const { records, deleteRecord } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SuspectRecord | null>(null);

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.offence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('AUTHORIZATION REQUIRED: CONFIRM PERMANENT RECORD DELETION?')) {
      deleteRecord(id, name);
      if (selectedRecord?.id === id) setSelectedRecord(null);
    }
  };

  if (selectedRecord) {
    return (
      <div className="page-container animate-in">
        <div className="section-header">
           <button className="back-link" onClick={() => setSelectedRecord(null)}>
            <ArrowLeft size={16} /> RETURN TO ARCHIVES
          </button>
        </div>

        <div className="record-details-grid">
          <div className="detail-card glass">
            <div className="detail-header">
              <div className="p-info">
                <div className="p-avatar">{selectedRecord.name.charAt(0)}</div>
                <div className="p-meta">
                  <h2>{selectedRecord.name}</h2>
                  <span className="p-uid">UID_{selectedRecord.id.toUpperCase()}</span>
                </div>
              </div>
              <div className={`p-priority ${selectedRecord.priority.toLowerCase()}`}>
                {selectedRecord.priority} THREAT
              </div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <span className="s-label">OFFENCE CHARGE</span>
                <span className="s-value accent">{selectedRecord.offence}</span>
              </div>
              <div className="spec-item">
                <span className="s-label">OPERATIONAL LOCATION</span>
                <span className="s-value">{selectedRecord.location || 'Central Station'}</span>
              </div>
              <div className="spec-item">
                <span className="s-label">REPORTING OFFICER</span>
                <span className="s-value font-mono">{selectedRecord.officerInCharge || 'System'}</span>
              </div>
              <div className="spec-item">
                <span className="s-label">APPREHENSION DATE</span>
                <span className="s-value font-mono">{selectedRecord.arrestDate}</span>
              </div>
              <div className="spec-item">
                <span className="s-label">BIOMETRIC AGE</span>
                <span className="s-value">{selectedRecord.age} YEARS</span>
              </div>
              <div className="spec-item">
                <span className="s-label">GENDER IDENTITY</span>
                <span className="s-value">{selectedRecord.gender.toUpperCase()}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="sec-btn"><Download size={18} /> EXPORT DOSSIER</button>
              <button className="dan-btn" onClick={(e) => handleDelete(selectedRecord.id, selectedRecord.name, e)}>
                <Trash2 size={18} /> PURGE DATA
              </button>
            </div>
          </div>

          <div className="intelligence-panel glass">
            <div className="i-header">
              <ShieldCheck size={18} />
              <h3>INTELLIGENCE CLEARANCE</h3>
            </div>
            <p>This record is protected under Level 4 Surveillance Protocol. All modifications are tracked via HQ Uplink.</p>
            <div className="i-footer">
               <span className="i-tag">ENCRYPTED</span>
               <span className="i-tag">LOGGED</span>
            </div>
          </div>
        </div>

        <style>{`
          .back-link {
            display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted);
            font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 2rem;
          }
          .back-link:hover { color: var(--accent-primary); transform: translateX(-4px); }

          .record-details-grid { display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
          .detail-card { padding: 3rem; border-radius: var(--radius-xl); }
          
          .detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4rem; }
          .p-info { display: flex; align-items: center; gap: 1.5rem; }
          .p-avatar { 
            width: 72px; height: 72px; border-radius: var(--radius-md); 
            background: rgba(56, 189, 248, 0.1); color: var(--accent-primary);
            display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800;
          }
          .p-meta h2 { font-size: 2rem; color: white; margin-bottom: 0.25rem; }
          .p-uid { font-size: 0.8rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

          .p-priority { font-size: 0.65rem; font-weight: 800; padding: 0.4rem 0.8rem; border-radius: 6px; letter-spacing: 1px; }
          .p-priority.critical { background: rgba(244, 63, 94, 0.1); color: var(--danger); border: 1px solid rgba(244, 63, 94, 0.2); }
          .p-priority.high { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
          .p-priority.medium { background: rgba(56, 189, 248, 0.1); color: var(--accent-primary); }
          .p-priority.low { background: rgba(16, 185, 129, 0.1); color: var(--success); }

          .specs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3rem; margin-bottom: 5rem; }
          .spec-item { display: flex; flex-direction: column; gap: 0.75rem; }
          .s-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; }
          .s-value { font-size: 1.15rem; font-weight: 700; color: white; }
          .s-value.accent { color: var(--warning); }

          .detail-actions { display: flex; gap: 1.5rem; padding-top: 3rem; border-top: 1px solid var(--panel-border); }
          .sec-btn { background: rgba(255,255,255,0.03); color: white; border: 1px solid var(--panel-border); padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.75rem; }
          .dan-btn { background: rgba(244, 63, 94, 0.05); color: var(--danger); border: 1px solid rgba(244, 63, 94, 0.1); padding: 1rem 2rem; border-radius: var(--radius-md); font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.75rem; }
          .sec-btn:hover, .dan-btn:hover { transform: translateY(-2px); }

          .intelligence-panel { padding: 2rem; border-radius: var(--radius-xl); height: fit-content; }
          .i-header { display: flex; align-items: center; gap: 0.75rem; color: var(--accent-primary); margin-bottom: 1.5rem; }
          .i-header h3 { font-size: 0.85rem; letter-spacing: 1px; }
          .intelligence-panel p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }
          .i-footer { display: flex; gap: 0.75rem; }
          .i-tag { font-size: 0.6rem; font-weight: 800; color: var(--text-muted); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--panel-border); }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header animate-in">
        <h1>Intelligence Library</h1>
        <p>Comprehensive repository of all authorized suspect dossiers</p>
      </div>

      <div className="toolbar glass animate-in">
        <div className="search-field">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Offence or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} /> FILTERS
        </button>
      </div>

      <div className="table-wrapper glass animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="t-header">
          <div className="c-info">SUSPECT IDENTIFIER</div>
          <div className="c-prio">PRIORITY</div>
          <div className="c-offence">OFFENCE</div>
          <div className="c-date">APPREHENSION</div>
          <div className="c-action"></div>
        </div>
        <div className="t-body">
          {filteredRecords.length === 0 ? (
            <div className="t-empty">
              <ShieldAlert size={40} />
              <p>NO CLASSIFIED DATA MATCHED YOUR QUERY.</p>
            </div>
          ) : (
            filteredRecords.map((r) => (
              <div key={r.id} className="t-row" onClick={() => setSelectedRecord(r)}>
                <div className="c-info">
                  <div className="r-avatar">{r.name.charAt(0)}</div>
                  <div className="r-meta">
                    <span className="r-name">{r.name}</span>
                    <span className="r-id">UID_{r.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <div className="c-prio">
                  <span className={`p-dot ${r.priority.toLowerCase()}`}></span>
                  <span className="p-text">{r.priority.toUpperCase()}</span>
                </div>
                <div className="c-offence">
                  <span className="o-tag">{r.offence}</span>
                </div>
                <div className="c-date font-mono">{r.arrestDate}</div>
                <div className="c-action">
                   <button className="row-del" onClick={(e) => handleDelete(r.id, r.name, e)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .toolbar { 
          display: flex; gap: 1.5rem; padding: 0.5rem 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem; align-items: center;
        }
        .search-field { flex: 1; display: flex; align-items: center; gap: 1rem; color: var(--text-muted); }
        .search-field input { background: transparent; border: none; color: white; width: 100%; padding: 1rem 0; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; }
        .search-field input:focus { outline: none; }
        .filter-btn { display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 0.75rem 1.5rem; border-radius: var(--radius-md); }

        .table-wrapper { border-radius: var(--radius-xl); overflow: hidden; }
        .t-header { 
          display: grid; grid-template-columns: 2.5fr 1fr 2fr 1.2fr 60px; padding: 1.25rem 2rem; 
          background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--panel-border);
          font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px;
        }
        .t-row { 
          display: grid; grid-template-columns: 2.5fr 1fr 2fr 1.2fr 60px; padding: 1.25rem 2rem; 
          align-items: center; border-bottom: 1px solid rgba(255,255,255,0.01); transition: var(--transition-smooth); cursor: pointer;
        }
        .t-row:hover { background: rgba(56,189,248,0.03); }

        .r-avatar { 
          width: 38px; height: 38px; border-radius: 8px; background: rgba(56, 189, 248, 0.1); color: var(--accent-primary);
          display: flex; align-items: center; justify-content: center; font-weight: 800;
        }
        .c-info { display: flex; align-items: center; gap: 1rem; }
        .r-meta { display: flex; flex-direction: column; }
        .r-name { font-weight: 700; color: white; font-size: 0.95rem; }
        .r-id { font-size: 0.7rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

        .c-prio { display: flex; align-items: center; gap: 0.75rem; }
        .p-dot { width: 6px; height: 6px; border-radius: 50%; }
        .p-dot.critical { background: var(--danger); box-shadow: 0 0 8px var(--danger); }
        .p-dot.high { background: var(--warning); }
        .p-dot.medium { background: var(--accent-primary); }
        .p-dot.low { background: var(--success); }
        .p-text { font-size: 0.7rem; font-weight: 800; color: var(--text-secondary); }

        .o-tag { font-size: 0.75rem; font-weight: 600; color: var(--warning); background: rgba(245, 158, 11, 0.05); padding: 4px 10px; border-radius: 6px; }
        .c-date { font-size: 0.85rem; color: var(--text-muted); }
        
        .row-del { color: var(--text-muted); padding: 0.5rem; border-radius: 8px; }
        .row-del:hover { background: rgba(244, 63, 94, 0.1); color: var(--danger); }

        .t-empty { padding: 6rem; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
      `}</style>
    </div>
  );
};

export default Records;
