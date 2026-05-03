import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, LogOut, X, Calendar, FileText,
  Bell, CreditCard, User, Search, BookOpen,
  ClipboardList, TrendingUp, Shield, Users, Home, Clock,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCityStore } from '../../store/cityStore';

const PATIENT_LINKS = [
  { to: '/patient/search-doctors',  icon: Search,       label: 'Find Doctors' },
  { to: '/patient/appointments',    icon: Calendar,     label: 'Appointments' },
  { to: '/patient/medical-history', icon: Clock,        label: 'Medical History' },
  { to: '/patient/prescriptions',   icon: FileText,     label: 'Prescriptions' },
  { to: '/patient/payments',        icon: CreditCard,   label: 'Payments' },
  { to: '/patient/privacy',         icon: Shield,       label: 'Data Privacy' },
  { to: '/patient/notifications',   icon: Bell,         label: 'Notifications' },
  { to: '/patient/profile',         icon: User,         label: 'Profile' },
];

const DOCTOR_LINKS = [
  { to: '/doctor/today',           icon: Home,          label: "Today's Schedule" },
  { to: '/doctor/requests',        icon: ClipboardList, label: 'Requests' },
  { to: '/doctor/appointments',    icon: Calendar,      label: 'Appointments' },
  { to: '/doctor/records',         icon: BookOpen,      label: 'Patient Records' },
  { to: '/doctor/access-requests', icon: Shield,        label: 'Access Requests' },
  { to: '/doctor/earnings',        icon: TrendingUp,    label: 'Earnings' },
  { to: '/doctor/notifications',   icon: Bell,          label: 'Notifications' },
  { to: '/doctor/profile',         icon: User,          label: 'Profile' },
];

export default function Sidebar({ role, open, onClose }) {
  const { user, logout } = useAuthStore();
  const { city, clearCity } = useCityStore();
  const navigate = useNavigate();
  const links = role === 'PATIENT' ? PATIENT_LINKS : DOCTOR_LINKS;

  const handleLogout = () => {
    logout();
    clearCity();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full sidebar-gradient text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center shadow-btn flex-shrink-0">
          <Stethoscope size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white leading-tight truncate">Anti Doctor</p>
          <p className="text-[11px] text-white/50 truncate">{city || 'No city'}</p>
        </div>
        {/* Mobile close */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User chip */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-white/50 truncate">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
               ${isActive
                 ? 'bg-white/15 text-white shadow-sm'
                 : 'text-white/60 hover:bg-white/8 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-brand-300' : 'text-white/50 group-hover:text-white/80'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{ width: 'var(--sidebar-w)' }}
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30 flex-shrink-0"
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              style={{ width: 'var(--sidebar-w)' }}
              className="fixed top-0 left-0 h-screen z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
