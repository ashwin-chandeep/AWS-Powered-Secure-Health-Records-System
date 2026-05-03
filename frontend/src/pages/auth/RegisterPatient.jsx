import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerPatient } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';

export default function RegisterPatient() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSession } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await registerPatient(form);
      if (data.ok && data.token && data.user) {
        setSession(data.token, data.user);
        toast.success('Account created! Welcome to Anti Doctor.');
        navigate('/select-city');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name',     label: 'Full Name',    type: 'text',     placeholder: 'John Doe' },
    { name: 'email',    label: 'Email',        type: 'email',    placeholder: 'john@example.com' },
    { name: 'phone',    label: 'Phone Number', type: 'tel',      placeholder: '9000000000' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-btn">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Create account</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Join as a patient</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
                <input
                  className="input-base"
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  className="input-base pr-11"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              <UserPlus size={18} /> Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-slate-500 mt-2">
            Are you a doctor?{' '}
            <Link to="/register/doctor" className="text-emerald-600 font-semibold hover:underline">Register as Doctor</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
