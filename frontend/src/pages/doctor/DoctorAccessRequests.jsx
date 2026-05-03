import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ShieldCheck, ShieldAlert, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorAccessRequests } from '../../api/accessRequestApi';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function DoctorAccessRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getDoctorAccessRequests();
      setRequests(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso)));
    } catch { toast.error('Failed to load requests'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Access Requests</h1>
        <p className="text-slate-500 mt-0.5">Track your requests to view patient medical histories</p>
      </div>

      {loading ? <SkeletonTable /> : requests.length === 0 ? (
        <EmptyState icon={Shield} title="No outbound requests" description="You have not requested access to any patient records." />
      ) : (
        <div className="grid gap-4">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  {req.patientName}
                  {req.status === 'APPROVED' && <ShieldCheck size={16} className="text-emerald-500" />}
                  {req.status === 'REJECTED' && <ShieldAlert size={16} className="text-red-500" />}
                  {req.status === 'PENDING' && <Clock size={16} className="text-brand-500" />}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Requested on {new Date(req.createdAtIso).toLocaleDateString()}</p>
                {req.status === 'APPROVED' && <p className="text-xs text-emerald-600 font-semibold mt-1">Status: Access Granted ({req.approvedScope.replace('_', ' ')})</p>}
                {req.status === 'REJECTED' && <p className="text-xs text-red-600 font-semibold mt-1">Status: Access Denied</p>}
                {req.status === 'PENDING' && <p className="text-xs text-brand-600 font-semibold mt-1">Status: Waiting for patient approval</p>}
              </div>

              {req.status === 'APPROVED' && (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto" onClick={() => navigate(`/doctor/patient-history/${req.patientId}`)}>
                    <FileText size={16} /> View History
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
