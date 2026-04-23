import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldAlert, 
  Scan, 
  Database,
  Activity,
  ChevronRight,
  Terminal,
  Cpu
} from 'lucide-react';

const Search: React.FC = () => {
  const { records } = useData();
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  const performSearch = () => {
    if (!query) return;
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      const found = records.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase())
      );
      setResult(found);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="section-header animate-in">
        <h1>Global Inquiry</h1>
        <p>Cross-reference biometric tokens and identity dossiers across HQ databases</p>
      </div>

      <div className="search-interface animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="search-box glass">
          <div className="s-icon-container">
            <Scan size={28} className={isScanning ? 'scanning-icon' : ''} />
          </div>
          <div className="s-input-container">
            <label>HQ_QUERY_PARAMETERS</label>
            <input 
              type="text" 
              placeholder="Enter name, ID or offense category..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
            />
          </div>
          <button className="execute-btn" onClick={performSearch} disabled={isScanning}>
            {isScanning ? 'CROSS-REFERENCING...' : 'RUN INQUIRY'}
          </button>
        </div>

        <div className="search-metrics">
          <div className="m-pill glass"><Database size={14} /> <span>DB_ENCRYPTED</span></div>
          <div className="m-pill glass"><Cpu size={14} /> <span>CORE_STABLE</span></div>
          <div className="m-pill glass"><Activity size={14} /> <span>14ms_LATENCY</span></div>
        </div>
      </div>

      <div className="inquiry-results animate-in" style={{ animationDelay: '0.2s' }}>
        {isScanning && (
          <div className="scan-overlay glass">
            <div className="scan-line-horizontal"></div>
            <div className="scan-portal-text">
               <Terminal size={24} />
               <span>SCANNING CENTRAL ARCHIVES...</span>
               <p>Bypassing regional firewalls. Establishing secure handshake.</p>
            </div>
          </div>
        )}

        {result && result.length > 0 && (
          <div className="results-grid">
            {result.map((r, i) => (
              <div key={r.id} className="result-card glass animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="r-card-header">
                  <div className="r-avatar">{r.name.charAt(0)}</div>
                  <div className="r-meta">
                    <h4>{r.name}</h4>
                    <span className="font-mono">UID_{r.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <div className="r-card-body">
                  <div className="r-row">
                    <span>STATUS</span>
                    <span className="accent-text">ACTIVE DOSSIER</span>
                  </div>
                  <div className="r-row">
                    <span>OFFENSE</span>
                    <span className="offense-text">{r.offence}</span>
                  </div>
                </div>
                <button className="open-file-btn">ACCESS FULL ARCHIVE <ChevronRight size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {result && result.length === 0 && !isScanning && (
          <div className="no-result glass">
            <ShieldAlert size={48} />
            <h3>ZERO MATCHES DETECTED</h3>
            <p>The query returned no matching identifiers in the HQ central database. Please verify your clearance level and query parameters.</p>
          </div>
        )}
      </div>

      <style>{`
        .search-interface { max-width: 1000px; margin: 0 auto 4rem; }
        .search-box { display: flex; align-items: center; gap: 2rem; padding: 1.25rem 1.5rem 1.25rem 2.5rem; border-radius: var(--radius-xl); }
        .s-icon-container { color: var(--accent-primary); }
        .scanning-icon { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .s-input-container { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .s-input-container label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); letter-spacing: 2px; }
        .s-input-container input { 
          background: transparent; border: none; color: white; font-size: 1.2rem; font-weight: 600; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .s-input-container input:focus { outline: none; }

        .execute-btn { background: white; color: black; font-weight: 800; font-size: 0.85rem; padding: 1.2rem 2.5rem; border-radius: var(--radius-md); transition: var(--transition-smooth); }
        .execute-btn:hover:not(:disabled) { background: var(--accent-primary); color: white; transform: translateY(-2px); }

        .search-metrics { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; }
        .m-pill { padding: 0.5rem 1.25rem; border-radius: 100px; display: flex; align-items: center; gap: 0.75rem; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); border-color: rgba(255,255,255,0.05); }

        .scan-overlay { max-width: 1000px; margin: 0 auto; height: 200px; border-radius: var(--radius-xl); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; }
        .scan-line-horizontal { position: absolute; left: 0; top: 0; width: 100%; height: 2px; background: var(--accent-primary); box-shadow: 0 0 15px var(--accent-primary); animation: scanV 3s linear infinite; }
        @keyframes scanV { from { top: 0; } to { top: 100%; } }
        
        .scan-portal-text { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--accent-primary); z-index: 2; }
        .scan-portal-text span { font-weight: 800; letter-spacing: 2px; font-size: 0.9rem; }
        .scan-portal-text p { font-size: 0.8rem; color: var(--text-muted); }

        .results-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .result-card { padding: 2rem; border-radius: var(--radius-xl); transition: var(--transition-smooth); }
        .result-card:hover { transform: translateY(-8px); border-color: var(--accent-primary); }
        
        .r-card-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--panel-border); }
        .r-avatar { width: 48px; height: 48px; border-radius: 10px; background: rgba(56, 189, 248, 0.1); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .r-meta h4 { font-size: 1.15rem; color: white; margin-bottom: 0.25rem; }
        .r-meta span { font-size: 0.75rem; color: var(--text-muted); }

        .r-card-body { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .r-row { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.5px; }
        .r-row span:first-child { color: var(--text-muted); }
        .accent-text { color: var(--success); }
        .offense-text { color: var(--warning); text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 150px; }

        .open-file-btn { width: 100%; border: 1px solid var(--panel-border); padding: 0.875rem; border-radius: 10px; color: white; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: rgba(255,255,255,0.02); }
        .open-file-btn:hover { background: rgba(56, 189, 248, 0.1); border-color: var(--accent-primary); }

        .no-result { max-width: 800px; margin: 4rem auto; padding: 5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 2rem; color: var(--text-muted); }
        .no-result h3 { color: white; letter-spacing: 1px; }
        .no-result p { line-height: 1.6; }
      `}</style>
    </div>
  );
};

export default Search;
