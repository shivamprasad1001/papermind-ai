
import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from './icons';

interface ToastProps {
  toast: ToastType;
}

const toastConfig = {
  success: {
    Icon: CheckCircleIcon,
    bg: 'bg-green-500/90',
  },
  error: {
    Icon: XCircleIcon,
    bg: 'bg-red-500/90',
  },
  info: {
    Icon: InfoIcon,
    bg: 'bg-blue-500/90',
  },
};

const Toast = ({ toast }: ToastProps) => {
  const { dispatch } = useAppContext();
  const [isExiting, setIsExiting] = useState(false);

  const { Icon, bg } = toastConfig[toast.type];

  useEffect(() => {
    const removeTimer = setTimeout(() => {
        setIsExiting(true);
    }, 4000); // Start exit animation after 4 seconds

    const dispatchTimer = setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, 4300); // Remove from state after animation
    
    return () => {
        clearTimeout(removeTimer);
        clearTimeout(dispatchTimer);
    };
  }, [toast.id, dispatch]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: toast.id });
    }, 300);
  };

  return (
    <div
      className={`
        flex items-center justify-between p-3 rounded-lg shadow-lg text-white backdrop-blur-sm
        ${bg} 
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
    >
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
