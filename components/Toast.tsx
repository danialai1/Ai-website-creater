import React from 'react';
import { Icon } from './Icons';
import type { ToastType } from '../hooks/useToast';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: 'Check' as const,
    bgClass: 'bg-success/30 border-success',
    iconClass: 'text-success',
  },
  error: {
    icon: 'XCircle' as const,
    bgClass: 'bg-danger/30 border-danger',
    iconClass: 'text-danger',
  },
  info: {
    icon: 'Info' as const,
    bgClass: 'bg-primary/30 border-primary',
    iconClass: 'text-accent',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const config = toastConfig[type];

  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-xl shadow-lg w-full backdrop-blur-lg border animate-toast-in text-light ${config.bgClass}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="shrink-0 pt-0.5">
        <Icon name={config.icon} className={`w-6 h-6 ${config.iconClass}`} />
      </div>
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button onClick={onClose} className="p-1 -m-1 rounded-full hover:bg-white/20 transition-colors shrink-0" aria-label="Close notification">
        <Icon name="X" className="w-5 h-5" />
      </button>
    </div>
  );
};
