
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { state } = useAppContext();

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-2">
      {state.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
