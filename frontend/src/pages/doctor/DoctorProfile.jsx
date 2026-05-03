import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Activity, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCityStore } from '../../store/cityStore';

export default function DoctorProfile() {
  const { user } = useAuthStore();
  const { city } = useCityStore();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl3 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-card">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-emerald-500 to-teal-600" />
        
        {/* Avatar */}
        <div className="px-8 pb-8">
          <div className="-mt-16 mb-6 flex justify-between items-end">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-lg">
              <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl font-extrabold text-emerald-600">
                {user.name[0]?.toUpperCase()}
              </div>
            </div>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-extrabold border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
              {user.specialization || 'Doctor'}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{user.hospitalName} • ₹{user.fee} per visit</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-emerald-600"><Building size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Hospital/Clinic</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.hospitalName}</p></div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-emerald-600"><MapPin size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Address</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.clinicAddress || city}</p></div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-emerald-600"><Clock size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Working Hours</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.workingHoursStart} - {user.workingHoursEnd}</p></div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-emerald-600"><Phone size={20} /></div>
              <div><p className="text-xs text-slate-500 font-semibold uppercase">Contact</p><p className="text-sm font-bold text-slate-900 dark:text-white">{user.phone}</p><p className="text-xs text-slate-500 mt-0.5">{user.email}</p></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
