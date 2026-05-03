import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Check, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientAccessRequests, approveAccessRequest, rejectAccessRequest } from '../../api/accessRequestApi';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function PatientAccessRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPatientAccessRequests();
      setRequests(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso)));
    } catch { toast.error('Failed to load access requests'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id, scope) => {
    try {
      await approveAccessRequest(id, scope);
      toast.success('Access approved');
      load();
    } catch { toast.error('Failed to approve request'); }
  };

  const handleReject = async (id) => {
    try {
      await rejectAccessRequest(id);
      toast.success('Access rejected');
      load();
    } catch { toast.error('Failed to reject request'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Data Privacy & Access</h1>
        <p className="text-slate-500 mt-0.5">Manage doctor requests to view your complete medical history</p>
      </div>

      {loading ? <SkeletonTable /> : requests.length === 0 ? (
        <EmptyState icon={Shield} title="No access requests" description="No doctors have requested access to your records." />
      ) : (
        <div className="grid gap-4">
          {requests.map((req, i) => (
            <motion.div key={req.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Dr. {req.doctorName}
                  {req.status === 'APPROVED' && <ShieldCheck size={16} className="text-emerald-500" />}
                  {req.status === 'REJECTED' && <ShieldAlert size={16} className="text-red-500" />}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Requested on {new Date(req.createdAtIso).toLocaleDateString()}</p>
                {req.status === 'APPROVED' && <p className="text-xs text-emerald-600 font-semibold mt-1">Status: Access Granted ({req.approvedScope.replace('_', ' ')})</p>}
                {req.status === 'REJECTED' && <p className="text-xs text-red-600 font-semibold mt-1">Status: Access Denied</p>}
                {req.status === 'PENDING' && <p className="text-xs text-brand-600 font-semibold mt-1">Status: Pending your approval</p>}
              </div>

              {req.status === 'PENDING' && (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                  <Button variant="danger" className="w-full sm:w-auto" onClick={() => handleReject(req.id)}><X size={16} /> Reject</Button>
                  <Button variant="primary" className="w-full sm:w-auto" onClick={() => handleApprove(req.id, 'ALL_DOCTORS')}><Check size={16} /> Approve Full History</Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
