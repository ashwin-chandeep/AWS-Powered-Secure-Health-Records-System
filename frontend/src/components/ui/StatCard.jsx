import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'brand' }) {
  const colorMap = {
    brand:   { bg: 'from-brand-500 to-brand-600',   icon: 'bg-brand-100 text-brand-600' },
    cyan:    { bg: 'from-cyan-500 to-cyan-600',      icon: 'bg-cyan-100 text-cyan-600' },
    emerald: { bg: 'from-emerald-500 to-emerald-600', icon: 'bg-emerald-100 text-emerald-600' },
    amber:   { bg: 'from-amber-500 to-amber-600',    icon: 'bg-amber-100 text-amber-600' },
    rose:    { bg: 'from-rose-500 to-rose-600',      icon: 'bg-rose-100 text-rose-600' },
    violet:  { bg: 'from-violet-500 to-violet-600',  icon: 'bg-violet-100 text-violet-600' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white dark:bg-slate-800 rounded-xl2 p-5 shadow-card border border-slate-100 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <span className={`p-2 rounded-xl ${c.icon}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {trend !== undefined && (
        <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
        </p>
      )}
    </motion.div>
  );
}
