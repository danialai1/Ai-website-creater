import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Toast } from '../components/Toast';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  // FIX: Replaced JSX with React.createElement to resolve parsing errors in a .ts file.
  // JSX syntax is not supported in .ts files and requires a .tsx file extension.
  // This change makes the component compatible with the .ts file extension.
  return React.createElement(
    ToastContext.Provider,
    { value: { addToast } },
    children,
    React.createElement(
      'div',
      { className: 'fixed top-8 right-4 sm:right-8 z-50 space-y-3 w-full max-w-sm' },
      toasts.map((toast) =>
        React.createElement(Toast, {
          key: toast.id,
          message: toast.message,
          type: toast.type,
          onClose: () => removeToast(toast.id),
        })
      )
    )
  );
};
