import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useCityStore, AVAILABLE_CITIES } from '../../store/cityStore';
import { useAuthStore } from '../../store/authStore';

const CITY_META = {
  Chennai: { emoji: '🏙️', desc: 'Capital city of Tamil Nadu', color: 'from-orange-400 to-rose-500' },
  Madurai: { emoji: '🕌', desc: 'Temple city of South India', color: 'from-violet-500 to-purple-600' },
};

export default function SelectCity() {
  const { setCity } = useCityStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const pick = (city) => {
    setCity(city);
    if (user?.role === 'PATIENT') navigate('/patient/search-doctors');
    else navigate('/doctor/today');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      {/* Blobs */}
      <div className="blob w-80 h-80 bg-brand-400 top-0 left-0 fixed" style={{ opacity: 0.12 }} />
      <div className="blob w-64 h-64 bg-violet-500 bottom-0 right-0 fixed" style={{ opacity: 0.12 }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center max-w-xl w-full">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-btn">
            <MapPin size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Select Your City</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Choose your city to find doctors and services near you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {AVAILABLE_CITIES.map((city, i) => {
            const meta = CITY_META[city] || { emoji: '🏙️', desc: '', color: 'from-brand-500 to-cyan-500' };
            return (
              <motion.button
                key={city}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(99,102,241,0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick(city)}
                className="bg-white dark:bg-slate-900 rounded-xl3 p-8 shadow-card border border-slate-100 dark:border-slate-800 text-center cursor-pointer transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center mx-auto mb-4 text-3xl shadow-btn group-hover:scale-110 transition-transform`}>
                  {meta.emoji}
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">{city}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{meta.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
