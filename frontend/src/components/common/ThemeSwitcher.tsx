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
    localStorage.setItem('papermind-theme', theme);
    setIsOpen(false);
  };

  const currentTheme = themes.find(t => t.value === state.theme);
  const CurrentIcon = currentTheme?.icon || MoonIcon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-[var(--bg-surface)]/80 backdrop-blur-sm hover:bg-[var(--bg-input)] transition-all duration-300 group border border-[var(--bg-border)] hover:border-[var(--bg-button)] shadow-sm hover:shadow-md"
        aria-label={`Current theme: ${currentTheme?.label}. Click to change theme`}
      >
        <CurrentIcon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--bg-button)] transition-all duration-300" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-55 mb-3 bg-[var(--bg-surface)]/95 backdrop-blur-lg border border-[var(--bg-border)] rounded-2xl shadow-2xl p-4 z-50 animate-fade-in min-w-64">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Choose Theme</h3>
              <p className="text-xs text-[var(--text-secondary)]">Select your preferred appearance</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--bg-input)] transition-colors"
              aria-label="Close theme selector"
            >
              <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isActive = theme.value === state.theme;
              
              return (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`
                    p-4 rounded-xl transition-all duration-300 relative group flex flex-col items-center space-y-2 border-2
                    ${isActive 
                      ? 'bg-[var(--bg-button)]/10 border-[var(--bg-button)] text-[var(--bg-button)] shadow-lg transform scale-105' 
                      : 'bg-[var(--bg-input)]/50 border-transparent hover:bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--bg-border)] hover:scale-105'
                    }
                  `}
                  title={`Switch to ${theme.label} theme`}
                >
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-medium">{theme.label}</span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--bg-button)] rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-[var(--bg-border)]">
            <p className="text-xs text-[var(--text-secondary)] text-center">
              Theme preference is saved automatically
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;