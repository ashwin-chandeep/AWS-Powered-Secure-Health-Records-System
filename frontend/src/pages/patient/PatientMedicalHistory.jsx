import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getPatientAppointments } from '../../api/appointmentApi';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';

export default function PatientMedicalHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPatientAppointments()
      .then(({ data }) => {
        const completed = data
          .filter((a) => a.status === 'COMPLETED')
          .sort((a, b) => b.slotIso?.localeCompare(a.slotIso));
        setAppointments(completed);
      })
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Medical History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Your completed consultations</p>
      </div>

      {loading ? <SkeletonTable rows={5} /> : appointments.length === 0 ? (
        <EmptyState icon={BookOpen} title="No medical history"
          description="Completed appointments will appear here" />
      ) : (
        <div className="space-y-3">
          {appointments.map((apt, i) => (
            <motion.div key={apt.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {apt.doctorName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{apt.doctorName}</span>
                    <Badge status={apt.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {apt.specialization} · {apt.serviceName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar size={11} />
                    {apt.slotIso ? new Date(apt.slotIso).toLocaleDateString('en-IN', { dateStyle: 'long' }) : '—'}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/patient/prescriptions`)}
                  className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700 transition-colors"
                >
                  View Rx <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
