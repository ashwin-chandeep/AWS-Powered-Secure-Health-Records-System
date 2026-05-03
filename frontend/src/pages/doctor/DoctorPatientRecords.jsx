import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorPrescriptions } from '../../api/prescriptionApi';
import { useAuthStore } from '../../store/authStore';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function DoctorPatientRecords() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getDoctorPrescriptions(user.id)
      .then(({ data }) => {
        const sorted = data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso));
        setRecords(sorted);
        setFiltered(sorted);
      })
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false));
  }, [user.id]);

  useEffect(() => {
    if (!query) setFiltered(records);
    else {
      const q = query.toLowerCase();
      setFiltered(records.filter(r => r.patientName.toLowerCase().includes(q) || r.diagnosis.toLowerCase().includes(q)));
    }
  }, [query, records]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Patient Records</h1>
          <p className="text-slate-500 mt-0.5">Access history of your written prescriptions</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input-base pl-9" placeholder="Search patient or diagnosis..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? <SkeletonTable /> : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No records found" description="You haven't written any prescriptions yet or no matches found." />
      ) : (
        <div className="grid gap-4">
          {filtered.map((rx, i) => (
            <motion.div key={rx.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/doctor/prescriptions/${rx.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card cursor-pointer hover:border-brand-300 transition-all flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/30 dark:to-violet-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {rx.patientName[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{rx.patientName}</h3>
                <p className="text-sm text-slate-500 font-medium">{rx.diagnosis}</p>
                <div className="flex gap-3 mt-1.5 text-xs text-slate-400">
                  <span>{new Date(rx.createdAtIso).toLocaleDateString()}</span>
                  <span>{rx.medicines?.length || 0} medicines prescribed</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
