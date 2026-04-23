import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, Terminal, Activity } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (err: any) {
      setError('ACCESS DENIED: INVALID OFFICER CREDENTIALS');
      setIsAuthenticating(false);
    }
  };

  const handleSetupAdmin = async () => {
    setIsAuthenticating(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, "admin@gmail.com", "police1");
      await setDoc(doc(db, "officers", userCredential.user.uid), {
        email: "admin@gmail.com",
        role: "Chief Administrator",
        createdAt: new Date().toISOString()
      });
      setSuccess('COMMAND PROFILE INITIALIZED. ACCESS GRANTED.');
    } catch (err: any) {
      setError('INITIALIZATION ERROR: ' + err.code);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="login-page">
      <div className="grid-overlay"></div>
      
      <div className="login-card glass animate-in">
        <div className="login-brand">
          <div className="logo-box">
            <ShieldCheck size={48} className="logo" />
          </div>
          <h1>GHANA POLICE HQ</h1>
          <p>COMMAND INTELLIGENCE NETWORK</p>
        </div>

        <form onSubmit={handleLogin} className="login-box-form">
          <div className="input-row">
            <label><User size={14} /> OFFICER EMAIL</label>
            <input 
              type="email" 
              placeholder="id@hq.gov.gh"
              value={credentials.email}
              onChange={e => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>

          <div className="input-row">
            <label><Lock size={14} /> SECURITY KEY</label>
            <div className="pass-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Keycode"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="login-msg error"><AlertCircle size={16} /> {error}</div>}
          {success && <div className="login-msg success"><ShieldCheck size={16} /> {success}</div>}

          <button type="submit" className="login-cta" disabled={isAuthenticating}>
            {isAuthenticating ? 'AUTHENTICATING...' : 'ESTABLISH LINK'}
          </button>
          
          {!success && (
            <button type="button" className="setup-link" onClick={handleSetupAdmin}>
              INITIALIZE REMOTE ACCESS
            </button>
          )}
        </form>

        <div className="login-footer-info">
          <div className="f-stat"><Activity size={12} /> <span>CONN: STABLE</span></div>
          <div className="f-stat"><Terminal size={12} /> <span>ENC: ACTIVE</span></div>
        </div>
      </div>

      <style>{`
        .login-page {
          position: fixed; inset: 0; background: var(--bg-main);
          display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 2rem;
        }

        .login-card {
          width: 100%; max-width: 440px; padding: 4rem 3rem; border-radius: 32px;
        }

        .login-brand { text-align: center; margin-bottom: 3rem; }
        .logo-box { 
          width: 80px; height: 80px; background: rgba(56, 189, 248, 0.1); 
          color: var(--accent-primary); border-radius: 20px; display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem; border: 1px solid rgba(56, 189, 248, 0.2); box-shadow: 0 0 30px rgba(56, 189, 248, 0.1);
        }
        
        .login-brand h1 { font-size: 1.5rem; font-weight: 800; color: white; letter-spacing: 1px; }
        .login-brand p { font-size: 0.7rem; font-weight: 700; color: var(--text-muted); letter-spacing: 3px; margin-top: 0.5rem; }

        .login-box-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .input-row { display: flex; flex-direction: column; gap: 0.75rem; }
        .input-row label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; letter-spacing: 1px; }
        .input-row input { 
          background: rgba(255,255,255,0.02); border: 1px solid var(--panel-border); padding: 1rem 1.25rem; border-radius: var(--radius-md); 
          color: white; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; transition: var(--transition-smooth);
        }
        .input-row input:focus { border-color: var(--accent-primary); outline: none; background: rgba(255,255,255,0.04); }

        .pass-wrapper { position: relative; }
        .eye-btn { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

        .login-cta { 
          background: white; color: black; padding: 1.1rem; border-radius: var(--radius-md); font-weight: 800; font-size: 0.9rem; letter-spacing: 1px;
          margin-top: 1rem; cursor: pointer; transition: var(--transition-smooth);
        }
        .login-cta:hover { background: var(--accent-primary); color: white; transform: translateY(-2px); }

        .login-msg { padding: 1rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; }
        .login-msg.error { background: rgba(244, 63, 94, 0.05); color: var(--danger); border: 1px solid rgba(244, 63, 94, 0.1); }
        .login-msg.success { background: rgba(16, 185, 129, 0.05); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.1); }

        .setup-link { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-align: center; text-decoration: underline; opacity: 0.5; }
        .setup-link:hover { opacity: 1; color: var(--accent-primary); }

        .login-footer-info { display: flex; justify-content: center; gap: 2rem; margin-top: 3rem; }
        .f-stat { display: flex; align-items: center; gap: 0.5rem; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); letter-spacing: 0.5px; }
      `}</style>
    </div>
  );
};

export default Login;
