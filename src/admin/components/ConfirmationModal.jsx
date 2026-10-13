import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'warning' | 'info'
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
    }
  }[confirmVariant] || {
    icon: AlertTriangle,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white'
  };

  const IconComponent = variantStyles.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-[#121418] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border ${variantStyles.iconBg} shrink-0`}>
              <IconComponent className={`w-6 h-6 ${variantStyles.iconColor}`} />
            </div>

            <div className="flex-1">
              <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2 text-sm font-semibold rounded-xl shadow-sm transition-all duration-150 ${variantStyles.buttonBg}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
