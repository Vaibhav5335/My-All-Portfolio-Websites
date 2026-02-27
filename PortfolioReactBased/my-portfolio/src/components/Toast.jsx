import { useState, useEffect, useRef } from 'react';
import { TOAST_DURATION } from '../utils/constants';

export const Toast = ({ message, type = 'success', onClose, duration = TOAST_DURATION.DEFAULT }) => {
  const [isVisible, setIsVisible] = useState(true);
  const closeTimeoutRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  useEffect(() => {
    if (duration > 0 && isVisible) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        closeTimeoutRef.current = setTimeout(() => {
          onClose?.();
        }, 300);
      }, duration);

      return () => {
        if (autoCloseTimerRef.current) {
          clearTimeout(autoCloseTimerRef.current);
          autoCloseTimerRef.current = null;
        }
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }
      };
    }
  }, [duration, onClose, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      onClose?.();
      closeTimeoutRef.current = null;
    }, 300);
  };

  if (!isVisible) return null;

  const bgColor = type === 'error' 
    ? 'bg-red-500/90' 
    : type === 'warning'
    ? 'bg-yellow-500/90'
    : 'bg-[#3be8b0]/90';

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fadeIn min-w-[300px] w-full`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={handleClose}
        className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;
  
  return (
    <div 
      className="fixed top-20 right-4 z-50 space-y-2 max-w-md" 
      aria-live="polite" 
      aria-atomic="true"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};