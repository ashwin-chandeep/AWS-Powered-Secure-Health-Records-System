import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorAppointments } from '../../api/appointmentApi';
import { createAccessRequest } from '../../api/accessRequestApi';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getDoctorAppointments()
      .then(({ data }) => setAppointments(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso))))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? appointments.filter(a => a.status === filter) : appointments;

  const handleRequestAccess = async (patientId, patientName) => {
    try {
      await createAccessRequest({ patientId, patientName });
      toast.success('Access request sent to patient');
    } catch {
      toast.error('Failed to send request. You might already have one pending.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">All Appointments</h1>
          <p className="text-slate-500 mt-0.5">View your complete consultation history</p>
        </div>
        <select className="input-base w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? <SkeletonTable rows={6} /> : filtered.length === 0 ? (
        <EmptyState icon={Calendar} title="No records found" description="No appointments match the current filter." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Patient</th>
                  <th className="p-4 font-semibold">Service</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((apt, i) => (
                  <motion.tr key={apt.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(apt.slotIso).toLocaleDateString()} · {new Date(apt.slotIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{apt.patientName}</td>
                    <td className="p-4 text-sm text-slate-500">{apt.serviceName}</td>
                    <td className="p-4"><Badge status={apt.status} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleRequestAccess(apt.patientId, apt.patientName)} className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5">
                        <Shield size={14} /> Request History
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
