import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      role="region"
      aria-label="Powiadomienia"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/15 ${
                isError
                  ? 'bg-rose-950/90 text-rose-100 border-rose-500/30 shadow-rose-950/50'
                  : isSuccess
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/30 shadow-emerald-950/50'
                  : 'bg-slate-900/90 text-slate-100 border-amber-500/30 shadow-slate-950/50'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {!isError && !isSuccess && <Info className="w-5 h-5 text-amber-400" />}
              </div>

              <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>

              <button
                onClick={() => onDismiss(toast.id)}
                aria-label="Zamknij powiadomienie"
                className="p-1 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
