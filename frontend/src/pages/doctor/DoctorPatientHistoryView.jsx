import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientPrescriptions } from '../../api/prescriptionApi';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';

export default function DoctorPatientHistoryView() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPatientPrescriptions(patientId)
      .then(({ data }) => setPrescriptions(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso))))
      .catch((err) => {
        if (err.response?.status === 403) {
          toast.error('Access Denied: Patient has not approved full history access.');
          setError(true);
        } else {
          toast.error('Failed to load patient history');
        }
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Patient Medical History</h1>
        <p className="text-slate-500 mt-0.5">Comprehensive prescription records across all doctors</p>
      </div>

      {loading ? <SkeletonTable /> : error ? (
        <EmptyState icon={Activity} title="Access Restricted" description="You do not have permission to view this patient's full medical history." />
      ) : prescriptions.length === 0 ? (
        <EmptyState icon={FileText} title="No records found" description="This patient has no prescription history." />
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((rx, i) => (
            <motion.div key={rx.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/doctor/prescriptions/${rx.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card cursor-pointer hover:border-brand-300 transition-all flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Dr. {rx.doctorName}</h3>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                    {new Date(rx.createdAtIso).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">Diagnosis: {rx.diagnosis}</p>
                <p className="text-xs text-slate-500 mt-0.5">{rx.hospitalName}</p>
                
                <div className="mt-4 flex gap-2 flex-wrap">
                  {rx.medicines?.map(m => (
                    <span key={m.id} className="text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 px-2 py-1 rounded-md border border-brand-100 dark:border-brand-800/50">
                      {m.tabletName}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
