import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'amoled';

interface UserProfile {
  name: string;
  station: string;
  badgeNumber: string;
  notifications: boolean;
}

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('hq-theme') as Theme) || 'dark';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hq-profile');
    return saved ? JSON.parse(saved) : {
      name: 'ADMINISTRATOR',
      station: 'HQ_ACCRA_CENTRAL',
      badgeNumber: 'GPS-8829-X',
      notifications: true
    };
  });

  useEffect(() => {
    localStorage.setItem('hq-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hq-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, profile, updateProfile }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
