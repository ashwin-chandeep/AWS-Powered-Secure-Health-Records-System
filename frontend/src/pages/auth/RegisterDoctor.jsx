import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Eye, EyeOff, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerDoctor } from '../../api/authApi';
import { getServices } from '../../api/serviceApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';

const STEPS = ['Basic Info', 'Clinic Info', 'Services & Timings'];

export default function RegisterDoctor() {
  const [step, setStep]     = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const { setSession } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    hospitalName: '', specialization: '', fee: '',
    clinicAddress: '', citySelection: 'Chennai',
    workingHoursStart: '09:00', workingHoursEnd: '17:00',
    slotIntervalMinutes: 30, serviceIds: [],
  });

  useEffect(() => {
    getServices().then(({ data }) => setServices(data)).catch(() => {});
  }, []);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const handleChange = (e) => set(e.target.name, e.target.value);

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((s) => s !== id)
        : [...f.serviceIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.serviceIds.length === 0) { toast.error('Select at least one service'); return; }
    setLoading(true);
    try {
      // Map city selection to approximate lat/lng for backend compatibility
      const lat = form.citySelection === 'Chennai' ? 13.0827 : 9.9252;
      const lng = form.citySelection === 'Chennai' ? 80.2707 : 78.1198;
      const payload = { ...form, fee: parseFloat(form.fee), lat, lng };
      const { data } = await registerDoctor(payload);
      if (data.ok && data.token && data.user) {
        setSession(data.token, data.user);
        toast.success('Doctor account created!');
        navigate('/doctor/today');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-btn">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Register as Doctor</h2>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i <= step ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}`}>
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-0.5 ${i < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 p-8">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">{STEPS[step]}</h3>

          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="space-y-4">
                {[
                  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Dr. John Doe' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'doctor@example.com' },
                  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '9000000000' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                    <input className="input-base" type={type} name={name} placeholder={placeholder}
                      value={form[name]} onChange={handleChange} required />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input className="input-base pr-11" type={showPw ? 'text' : 'password'} name="password"
                      placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                {[
                  { name: 'hospitalName',    label: 'Hospital / Clinic Name', placeholder: 'City Hospital' },
                  { name: 'specialization',  label: 'Specialization',         placeholder: 'Cardiology' },
                  { name: 'clinicAddress',   label: 'Clinic Address',         placeholder: '123 Main St, Chennai' },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                    <input className="input-base" name={name} placeholder={placeholder}
                      value={form[name]} onChange={handleChange} required />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">City</label>
                  <select className="input-base" name="citySelection" value={form.citySelection} onChange={handleChange} required>
                    <option value="Chennai">Chennai</option>
                    <option value="Madurai">Madurai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Consultation Fee (₹)</label>
                  <input className="input-base" type="number" name="fee" placeholder="500"
                    value={form.fee} onChange={handleChange} required min={0} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Start Time</label>
                    <input className="input-base" type="time" name="workingHoursStart"
                      value={form.workingHoursStart} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">End Time</label>
                    <input className="input-base" type="time" name="workingHoursEnd"
                      value={form.workingHoursEnd} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Slot Duration (minutes)</label>
                  <select className="input-base" name="slotIntervalMinutes"
                    value={form.slotIntervalMinutes} onChange={handleChange}>
                    {[15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Services Offered</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {services.map((svc) => (
                      <label key={svc.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-sm transition-all
                          ${form.serviceIds.includes(svc.id)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                        <input type="checkbox" className="sr-only" checked={form.serviceIds.includes(svc.id)}
                          onChange={() => toggleService(svc.id)} />
                        <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center
                          ${form.serviceIds.includes(svc.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                          {form.serviceIds.includes(svc.id) && <span className="text-white text-[10px]">✓</span>}
                        </span>
                        {svc.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 gap-3">
              {step > 0
                ? <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                    <ChevronLeft size={16} /> Back
                  </Button>
                : <div />
              }
              {step < STEPS.length - 1
                ? <Button type="button" variant="primary" onClick={() => setStep(step + 1)}>
                    Next <ChevronRight size={16} />
                  </Button>
                : <Button type="submit" variant="success" loading={loading}>
                    <UserPlus size={18} /> Complete Registration
                  </Button>
              }
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
