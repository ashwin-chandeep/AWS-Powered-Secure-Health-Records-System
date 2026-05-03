import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getPatientPrescriptions, downloadPrescriptionPdf } from '../../api/prescriptionApi';
import { useAuthStore } from '../../store/authStore';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function PatientPrescriptions() {
  const { user } = useAuthStore();
  const navigate  = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientPrescriptions(user.id)
      .then(({ data }) => setPrescriptions(data))
      .catch(() => toast.error('Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleDownload = async (id, e) => {
    e.stopPropagation();
    try {
      await downloadPrescriptionPdf(id);
    } catch { toast.error('Failed to download PDF'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Prescriptions</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? <SkeletonTable rows={4} /> : prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No prescriptions yet"
          description="Your doctor prescriptions will appear here" />
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx, i) => (
            <motion.div key={rx.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/patient/prescriptions/${rx.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-4 shadow-card cursor-pointer transition-all hover:border-brand-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Dr. {rx.doctorName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{rx.diagnosis}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rx.medicines?.length || 0} medicine{rx.medicines?.length !== 1 ? 's' : ''} ·{' '}
                    {rx.createdAtIso ? new Date(rx.createdAtIso).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => handleDownload(rx.id, e)}>
                    <Download size={15} />
                  </Button>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
