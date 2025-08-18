import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  GraduationCapIcon, 
  UserIcon, 
  MicroscopeIcon, 
  UsersIcon 
} from './icons';

type UserType = 'student' | 'teacher' | 'researcher' | 'general';

const userTypes: { value: UserType; label: string; icon: React.ComponentType<any>; description: string }[] = [
  { 
    value: 'student', 
    label: 'Student', 
    icon: GraduationCapIcon,
    description: 'Study guides, summaries, practice questions'
  },
  { 
    value: 'teacher', 
    label: 'Teacher', 
    icon: UserIcon,
    description: 'Lesson plans, activities, assessments'
  },
  { 
    value: 'researcher', 
    label: 'Researcher', 
    icon: MicroscopeIcon,
    description: 'Analysis, methodology, citations'
  },
  { 
    value: 'general', 
    label: 'General', 
    icon: UsersIcon,
    description: 'Balanced, comprehensive responses'
  },
];

const UserTypeSelector = () => {
  const { state, dispatch } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleUserTypeChange = (userType: UserType) => {
    console.log('Setting user type to:', userType);
    dispatch({ type: 'SET_USER_TYPE', payload: userType });
    setIsOpen(false);
  };

  const currentUserType = userTypes.find(t => t.value === state.userType) || userTypes[3];
  const CurrentIcon = currentUserType.icon;

  return (
    <div className="relative">
      <button
        onClick={() => {
          console.log('User type selector clicked, current state:', state.userType);
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-input)] transition-all duration-200 group border border-[var(--bg-border)] hover:border-[var(--border-button)] shadow-lg"
        aria-label="Select user type"
      >
        <div className="relative">
          <CurrentIcon className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-medium">
          {currentUserType.label} Mode
        </span>
        <svg 
          className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-lg shadow-xl p-3 z-50 animate-fade-in min-w-72 max-h-96 overflow-y-auto">
          <div className="text-xs text-[var(--text-secondary)] mb-3 font-medium">How would you like me to help you?</div>
          <div className="space-y-2">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              const isActive = userType.value === state.userType;
              
              return (
                <button
                  key={userType.value}
                  onClick={() => handleUserTypeChange(userType.value)}
                  className={`
                    w-full flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 text-left group hover:scale-[1.02]
                    ${isActive 
                      ? 'bg-[var(--bg-button)] text-white shadow-lg ring-2 ring-[var(--bg-button)]/50' 
                      : 'bg-[var(--bg-input)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }
                  `}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{userType.label}</div>
                    <div className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-white/90' : 'text-[var(--text-secondary)]'}`}>
                      {userType.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0 w-3 h-3 bg-green-400 rounded-full animate-pulse ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--bg-border)]">
            <div className="text-xs text-[var(--text-secondary)] text-center">
              💡 Tip: You can change this anytime to get different types of help
            </div>
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

export default UserTypeSelector; 