import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import Records from './pages/Records';
import Search from './pages/Search';
import Login from './pages/Login';
import Settings from './pages/Settings';
import { DataProvider } from './context/DataContext';
import { SettingsProvider } from './context/SettingsContext';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase/config';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0b0f1a',
        color: '#38bdf8',
        fontFamily: 'Plus Jakarta Sans',
        gap: '20px'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(56, 189, 248, 0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px' }}>INITIALIZING SECURITY PROTOCOLS...</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }


  if (!user) {
    return <Login />;
  }

  return (
    <SettingsProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddRecord />} />
              <Route path="/records" element={<Records />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </SettingsProvider>
  );
};

export default App;
