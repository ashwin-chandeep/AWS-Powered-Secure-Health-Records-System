import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCityStore } from '../../store/cityStore';

export default function PatientProfile() {
  const { user } = useAuthStore();
  const { city } = useCityStore();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl3 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-card">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-brand-500 to-violet-600" />
        
        {/* Avatar */}
        <div className="px-8 pb-8">
          <div className="-mt-12 mb-6 flex justify-between items-end">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-brand-600">
                {user.name[0]?.toUpperCase()}
              </div>
            </div>
            <span className="px-3 py-1 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 rounded-full text-xs font-bold border border-brand-200 dark:border-brand-800/50">
              PATIENT
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-500"><Mail size={18} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Email</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.email}</p></div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-500"><Phone size={18} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Phone</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.phone}</p></div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 sm:col-span-2">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-slate-500"><MapPin size={18} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Selected City</p><p className="text-sm font-bold text-slate-900 dark:text-white">{city || 'None'}</p></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
