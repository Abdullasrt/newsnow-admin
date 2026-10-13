import React from 'react';
import { useNews } from '../context/NewsContext';
import { CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = () => {
  const { toasts, removeToast } = useNews();

  // Always show only one toast message at a time
  const currentToast = toasts[toasts.length - 1];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="wait">
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-neutral-900/95 text-white dark:bg-neutral-100/95 dark:text-neutral-900 rounded-lg shadow-xl border border-neutral-700/30 dark:border-neutral-300/30 backdrop-blur-md text-sm"
          >
            <div className="flex items-center gap-2.5">
              {currentToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-rose-400 dark:text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{currentToast.message}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => removeToast(currentToast.id)}
              className="p-1 text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
