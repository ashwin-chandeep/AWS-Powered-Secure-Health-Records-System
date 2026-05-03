import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { upsertPrescription } from '../../api/prescriptionApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';

export default function PrescriptionCreate() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patientName: '', age: '', weight: '', gender: 'MALE',
    diagnosis: '', testRecommendations: '', doctorAdvice: '',
  });

  const [medicines, setMedicines] = useState([]);

  const addMedicine = () => {
    setMedicines([...medicines, {
      tabletName: '', durationDays: 3, foodInstruction: 'AFTER_FOOD',
      breakfast: false, lunch: false, dinner: false,
    }]);
  };

  const updateMed = (idx, field, value) => {
    const list = [...medicines];
    list[idx][field] = value;
    setMedicines(list);
  };

  const removeMed = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.some(m => !m.tabletName)) { toast.error('Medicine names cannot be empty'); return; }
    
    setLoading(true);
    try {
      await upsertPrescription({
        appointmentId: Number(appointmentId),
        doctorId: Number(user.id),
        patientId: 0, // backend maps via appointment if possible
        clinicName: user.clinicAddress || 'Clinic',
        hospitalName: user.hospitalName,
        doctorName: user.name,
        doctorRegistrationNo: 'REG123', // placeholder
        ...form,
        age: Number(form.age), weight: Number(form.weight),
        medicines
      });
      toast.success('Prescription created & sent to patient');
      navigate('/doctor/today');
    } catch { toast.error('Failed to save prescription'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors">
        <ChevronLeft size={16} /> Back
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText size={24} className="text-brand-500" /> Write Prescription
        </h1>
        <p className="text-slate-500 mt-0.5">Fill in patient details, diagnosis, and medicines.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-xl2 shadow-card border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">Patient Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Patient Name</label>
              <input className="input-base" value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Age</label>
              <input className="input-base" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required min={1} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Weight (kg)</label>
              <input className="input-base" type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} required min={1} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Gender</label>
              <select className="input-base" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-xl2 shadow-card border border-slate-100 dark:border-slate-800 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">Diagnosis & Advice</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Diagnosis</label>
              <textarea className="input-base min-h-[80px]" value={form.diagnosis} onChange={e => setForm({...form, diagnosis: e.target.value})} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Lab Tests (Optional)</label>
                <textarea className="input-base min-h-[80px]" value={form.testRecommendations} onChange={e => setForm({...form, testRecommendations: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Doctor Advice</label>
                <textarea className="input-base min-h-[80px]" value={form.doctorAdvice} onChange={e => setForm({...form, doctorAdvice: e.target.value})} required />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 rounded-xl2 shadow-card border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Medicines</h3>
            <Button type="button" variant="secondary" size="sm" onClick={addMedicine}><Plus size={16} /> Add</Button>
          </div>
          
          <div className="space-y-4">
            {medicines.map((m, i) => (
              <div key={i} className="flex flex-col md:flex-row items-end gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-500">Medicine Name</label>
                  <input className="input-base py-2" placeholder="Paracetamol 500mg" value={m.tabletName} onChange={e => updateMed(i, 'tabletName', e.target.value)} required />
                </div>
                <div className="w-full md:w-32">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-500">Days</label>
                  <input className="input-base py-2" type="number" min={1} value={m.durationDays} onChange={e => updateMed(i, 'durationDays', Number(e.target.value))} />
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-slate-500">Instruction</label>
                  <select className="input-base py-2" value={m.foodInstruction} onChange={e => updateMed(i, 'foodInstruction', e.target.value)}>
                    <option value="BEFORE_FOOD">Before Food</option><option value="AFTER_FOOD">After Food</option>
                  </select>
                </div>
                <div className="w-full md:w-auto flex items-center gap-3 bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 rounded-xl">
                  {['breakfast', 'lunch', 'dinner'].map(time => (
                    <label key={time} className="flex flex-col items-center gap-1 cursor-pointer">
                      <span className="text-[10px] font-bold uppercase">{time[0]}</span>
                      <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                        checked={m[time]} onChange={e => updateMed(i, time, e.target.checked)} />
                    </label>
                  ))}
                </div>
                <button type="button" onClick={() => removeMed(i)} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {medicines.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No medicines added.</p>}
          </div>
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full md:w-auto">
            Save Prescription
          </Button>
        </div>
      </form>
    </div>
  );
}
