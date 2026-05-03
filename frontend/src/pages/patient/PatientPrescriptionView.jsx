import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronLeft, Calendar, User, Activity, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPrescriptionById, downloadPrescriptionPdf } from '../../api/prescriptionApi';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function PatientPrescriptionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrescriptionById(id)
      .then(({ data }) => setPrescription(data))
      .catch(() => toast.error('Failed to load prescription'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      await downloadPrescriptionPdf(id);
    } catch { toast.error('Failed to download PDF'); }
  };

  if (loading) return <div className="max-w-3xl mx-auto"><SkeletonCard /><br /><SkeletonCard /></div>;
  if (!prescription) return <div className="text-center py-12 text-slate-500">Prescription not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <Button variant="primary" size="sm" onClick={handleDownload} className="shadow-btn">
          <Download size={16} /> Download PDF
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-600 to-violet-600 text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h2 className="text-2xl font-extrabold flex items-center gap-2"><FileText size={24} /> Prescription</h2>
              <p className="text-white/80 mt-1 flex items-center gap-1.5"><Calendar size={14} /> {new Date(prescription.createdAtIso).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
            <div className="text-left md:text-right">
              <h3 className="font-bold text-lg">Dr. {prescription.doctorName}</h3>
              <p className="text-white/80 text-sm">{prescription.clinicName}</p>
              <p className="text-white/70 text-xs mt-1">Reg: {prescription.doctorRegistrationNo}</p>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <User size={16} className="text-slate-400" /> <span className="font-semibold">{prescription.patientName}</span>
          </div>
          <div className="text-slate-600 dark:text-slate-400">Age: <span className="font-medium text-slate-900 dark:text-white">{prescription.age}</span></div>
          <div className="text-slate-600 dark:text-slate-400">Weight: <span className="font-medium text-slate-900 dark:text-white">{prescription.weight} kg</span></div>
          <div className="text-slate-600 dark:text-slate-400">Gender: <span className="font-medium text-slate-900 dark:text-white">{prescription.gender}</span></div>
        </div>

        {/* Details */}
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity size={16} /> Diagnosis</h4>
            <p className="text-slate-800 dark:text-slate-200">{prescription.diagnosis}</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Rx Medicines</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-slate-500 text-sm">
                    <th className="pb-2 font-semibold">Medicine</th>
                    <th className="pb-2 font-semibold">Dosage (M-A-N)</th>
                    <th className="pb-2 font-semibold">Duration</th>
                    <th className="pb-2 font-semibold">Instructions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {prescription.medicines.map((m, i) => (
                    <tr key={i} className="text-slate-800 dark:text-slate-200">
                      <td className="py-3 font-semibold">{m.tabletName}</td>
                      <td className="py-3">
                        {m.breakfast ? '1' : '0'} - {m.lunch ? '1' : '0'} - {m.dinner ? '1' : '0'}
                      </td>
                      <td className="py-3">{m.durationDays} days</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${m.foodInstruction === 'AFTER_FOOD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {m.foodInstruction.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {(prescription.testRecommendations || prescription.doctorAdvice) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {prescription.testRecommendations && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText size={16} /> Lab Tests</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">{prescription.testRecommendations}</p>
                </div>
              )}
              {prescription.doctorAdvice && (
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertCircle size={16} /> Advice</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">{prescription.doctorAdvice}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
