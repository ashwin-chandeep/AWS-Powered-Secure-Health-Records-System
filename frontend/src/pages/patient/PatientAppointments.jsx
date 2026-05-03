import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientAppointments, updateAppointmentStatus } from '../../api/appointmentApi';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPatientAppointments();
      setAppointments(data.sort((a, b) => b.createdAtIso?.localeCompare(a.createdAtIso)));
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  const filtered = statusFilter
    ? appointments.filter((a) => a.status === statusFilter)
    : appointments;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Track all your appointment requests</p>
        </div>
        <select className="input-base w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['REQUESTED','ACCEPTED','COMPLETED','REJECTED'].map(s =>
            <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <SkeletonTable rows={5} /> : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No appointments yet"
          description="Book your first appointment with a doctor" />
      ) : (
        <div className="space-y-3">
          {filtered.map((apt, i) => (
            <motion.div key={apt.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-4 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {apt.doctorName?.[0] || 'D'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{apt.doctorName}</span>
                    <Badge status={apt.status} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {apt.specialization} · {apt.hospitalName}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {apt.slotIso ? new Date(apt.slotIso).toLocaleDateString() : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {apt.slotIso ? new Date(apt.slotIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </span>
                    <span>{apt.serviceName}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
