import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Theme } from '../../types';
import { 
  SunIcon, 
  MoonIcon, 
  SparklesIcon, 
  LeafIcon, 
  StarIcon, 
  FireIcon 
} from './icons';

const themes: { value: Theme; label: string; icon: React.ComponentType<any> }[] = [
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'blue', label: 'Ocean', icon: SparklesIcon },
  { value: 'green', label: 'Nature', icon: LeafIcon },
  { value: 'purple', label: 'Royal', icon: StarIcon },
  { value: 'orange', label: 'Sunset', icon: FireIcon },
];

const ThemeSwitcher = () => {
  const { state, dispatch } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.value === state.theme);
  const CurrentIcon = currentTheme?.icon || MoonIcon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-input)] transition-all duration-200 group border border-[var(--bg-border)] hover:border-[var(--border-button)]"
        aria-label="Change theme"
      >
        <CurrentIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-lg shadow-xl p-3 z-50 animate-fade-in min-w-48">
          <div className="text-xs text-[var(--text-secondary)] mb-2 font-medium">Choose Theme</div>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isActive = theme.value === state.theme;
              
              return (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`
                    p-3 rounded-lg transition-all duration-300 relative group flex flex-col items-center space-y-1
                    ${isActive 
                      ? 'bg-[var(--bg-button)] text-white shadow-lg scale-105 ring-2 ring-[var(--bg-button)]/50' 
                      : 'bg-[var(--bg-input)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-105'
                    }
                  `}
                  title={theme.label}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{theme.label}</span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher; 