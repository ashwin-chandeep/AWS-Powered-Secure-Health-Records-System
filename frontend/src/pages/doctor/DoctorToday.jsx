import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle, Clock, Video, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getDoctorAppointments, updateAppointmentStatus } from '../../api/appointmentApi';
import { createAccessRequest } from '../../api/accessRequestApi';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function DoctorToday() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorAppointments();
      const todayIso = new Date().toISOString().slice(0, 10);
      const todayApts = data.filter((a) => a.slotIso?.startsWith(todayIso) && a.status === 'ACCEPTED');
      setAppointments(todayApts.sort((a, b) => a.slotIso.localeCompare(b.slotIso)));
    } catch { toast.error('Failed to load schedule'); }
    finally { setLoading(false); }
  };

  const markCompleted = async (id) => {
    try {
      await updateAppointmentStatus(id, 'COMPLETED');
      toast.success('Appointment marked as completed');
      load();
    } catch { toast.error('Failed to update status'); }
  };

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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Today's Schedule</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4"><SkeletonCard /><SkeletonCard /></div>
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarIcon} title="No appointments today" description="Take a rest or review pending requests." />
      ) : (
        <div className="space-y-4">
          {appointments.map((apt, i) => {
            const time = new Date(apt.slotIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card flex flex-col md:flex-row md:items-center gap-5"
              >
                {/* Time Indicator */}
                <div className="w-full md:w-32 flex-shrink-0 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
                  <Clock size={18} /> {time}
                </div>
                
                {/* Patient Info */}
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {apt.patientName[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">{apt.patientName}</h3>
                    <p className="text-sm text-slate-500">{apt.serviceName}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button onClick={() => handleRequestAccess(apt.patientId, apt.patientName)} title="Request Medical History" className="p-2 text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                    <Shield size={20} />
                  </button>
                  <Button variant="secondary" className="flex-1 md:flex-none">
                    <Video size={16} /> Join Call
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none" onClick={() => navigate(`/doctor/prescriptions/create/${apt.id}`)}>
                    Create Rx
                  </Button>
                  <Button variant="success" className="flex-1 md:flex-none" onClick={() => markCompleted(apt.id)}>
                    <CheckCircle size={16} /> Complete
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
