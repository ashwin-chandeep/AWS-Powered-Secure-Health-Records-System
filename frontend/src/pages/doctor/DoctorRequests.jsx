import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorRequests, updateAppointmentStatus } from '../../api/appointmentApi';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function DoctorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorRequests();
      setRequests(data);
    } catch { toast.error('Failed to load requests'); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Request ${status.toLowerCase()}`);
      load();
    } catch { toast.error('Failed to update request'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Appointment Requests</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Review and approve incoming patient requests</p>
      </div>

      {loading ? <SkeletonTable /> : requests.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No pending requests" description="You have responded to all appointment requests." />
      ) : (
        <div className="grid gap-4">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {req.patientName[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white">{req.patientName}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {new Date(req.slotIso).toLocaleDateString()} at {new Date(req.slotIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-1">{req.serviceName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="danger" className="flex-1 md:flex-none" onClick={() => handleAction(req.id, 'REJECTED')}>
                  <X size={16} /> Reject
                </Button>
                <Button variant="success" className="flex-1 md:flex-none" onClick={() => handleAction(req.id, 'ACCEPTED')}>
                  <Check size={16} /> Accept
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
