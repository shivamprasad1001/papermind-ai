import React from 'react';
import { useAppContext } from '../../context/AppContext';
import type { ChatMode } from '../../types';

const modes: { key: ChatMode; label: string }[] = [
  { key: 'general', label: 'General Chat' },
  { key: 'youtube', label: 'YouTube Chat' },
  { key: 'pdf', label: 'Chat with PDF' },
  { key: 'site', label: 'Site Chat' },
];

const NavBar: React.FC = () => {
  const { state, dispatch } = useAppContext();

  return (
    <nav className="w-full">
      <ul className="flex items-center gap-1">
        {modes.map(({ key, label }) => {
          const isActive = state.mode === key;
          return (
            <li key={key}>
              <button
                onClick={() => dispatch({ type: 'SET_MODE', payload: key })}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-[var(--bg-button)] text-white'
                    : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
