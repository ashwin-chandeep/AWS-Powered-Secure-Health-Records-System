import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const { setSession } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;
    setLoading(true);
    try {
      const { data } = await login(identifier.trim(), password);
      if (data.ok && data.token && data.user) {
        setSession(data.token, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'PATIENT') navigate('/select-city');
        else navigate('/doctor/today');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'patient') { setIdentifier('patient1.chennai@test.com'); setPassword('Test@123'); }
    else { setIdentifier('doctor.doc-chn-1@test.com'); setPassword('Test@123'); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between w-1/2 sidebar-gradient px-14 py-12 relative overflow-hidden"
      >
        {/* Blobs */}
        <div className="blob w-72 h-72 bg-brand-500 top-[-80px] left-[-60px]" />
        <div className="blob w-56 h-56 bg-violet-600 bottom-20 right-[-40px]" />
        <div className="blob w-40 h-40 bg-cyan-500 bottom-[-40px] left-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Stethoscope size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Anti Doctor</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Your Health,<br />Our Priority
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Book appointments, access prescriptions, track payments — all in one place.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { num: '50+', label: 'Doctors' },
            { num: '1000+', label: 'Patients served' },
            { num: '2', label: 'Cities' },
            { num: '24/7', label: 'Support' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
              <p className="text-2xl font-extrabold text-white">{num}</p>
              <p className="text-sm text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Anti Doctor</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Sign in</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Don't have an account?{' '}
            <Link to="/register/patient" className="text-brand-600 font-semibold hover:underline">Register</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email or Phone
              </label>
              <input
                className="input-base"
                placeholder="Enter email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  className="input-base pr-11"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <LogIn size={18} /> Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('patient')}
                className="text-xs px-3 py-2 rounded-lg bg-brand-50 text-brand-700 font-semibold hover:bg-brand-100 transition-colors border border-brand-200"
              >
                Patient Demo
              </button>
              <button
                onClick={() => fillDemo('doctor')}
                className="text-xs px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                Doctor Demo
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Register as{' '}
            <Link to="/register/patient" className="text-brand-600 font-semibold hover:underline">Patient</Link>
            {' '}or{' '}
            <Link to="/register/doctor" className="text-emerald-600 font-semibold hover:underline">Doctor</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
