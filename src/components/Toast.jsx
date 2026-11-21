import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './ui.jsx';

const ToastContext = createContext(() => {});

/** Lightweight confirmation toasts — the clay equivalent of a snackbar. */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const navigate = useNavigate();

  const show = useCallback((message, opts = {}) => {
    clearTimeout(timer.current);
    setToast({ message, icon: opts.icon ?? 'check_circle', action: opts.action, key: Date.now() });
    timer.current = setTimeout(() => setToast(null), opts.duration ?? 3200);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="fixed inset-x-0 bottom-28 z-[60] flex justify-center px-5 pointer-events-none">
        {toast && (
          <div
            key={toast.key}
            role="status"
            className="pointer-events-auto clay-btn-primary bg-primary text-on-primary rounded-full pl-4 pr-2 py-2 flex items-center gap-3 max-w-md animate-surface-enter"
          >
            <Icon name={toast.icon} size={20} className="text-accent" />
            <span className="font-label text-label-md">{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                className="bg-on-primary/15 rounded-full px-3 py-1.5 font-label text-label-sm"
                onClick={() => {
                  setToast(null);
                  navigate(toast.action.to);
                }}
              >
                {toast.action.label}
              </button>
            ) : (
              <button type="button" aria-label="Dismiss" className="w-8 h-8 rounded-full flex items-center justify-center" onClick={() => setToast(null)}>
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
