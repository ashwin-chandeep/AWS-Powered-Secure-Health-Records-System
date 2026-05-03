import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-btn hover:shadow-lg hover:brightness-110 focus:ring-brand-400',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    danger:
      'bg-gradient-to-r from-red-600 to-red-500 text-white hover:brightness-110 focus:ring-red-400',
    success:
      'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:brightness-110 focus:ring-emerald-400',
    ghost:
      'text-slate-600 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-300 dark:hover:bg-slate-800',
    outline:
      'border-2 border-brand-500 text-brand-600 hover:bg-brand-50 focus:ring-brand-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 60" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
