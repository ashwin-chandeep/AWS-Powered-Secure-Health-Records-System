import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Clock, Filter, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctors, getSpecializations } from '../../api/doctorApi';
import { getServices } from '../../api/serviceApi';
import { useCityStore } from '../../store/cityStore';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function SearchDoctors() {
  const { city } = useCityStore();
  const navigate  = useNavigate();

  const [doctors, setDoctors]           = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [specs, setSpecs]               = useState([]);
  const [services, setServices]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [query, setQuery]               = useState('');
  const [specFilter, setSpecFilter]     = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [docRes, specRes, svcRes] = await Promise.all([
          getDoctors(city),
          getSpecializations(city),
          getServices(city),
        ]);
        setDoctors(docRes.data);
        setFiltered(docRes.data);
        setSpecs(specRes.data);
        setServices(svcRes.data);
      } catch {
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [city]);

  useEffect(() => {
    let list = doctors;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.hospitalName.toLowerCase().includes(q)
      );
    }
    if (specFilter) list = list.filter((d) => d.specialization === specFilter);
    setFiltered(list);
  }, [query, specFilter, doctors]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Find Doctors</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
          Showing doctors in <span className="font-semibold text-brand-600">{city}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-4 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-base pl-9"
              placeholder="Search by name or hospital…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input-base" value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}>
            <option value="">All Specializations</option>
            {specs.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => { setQuery(''); setSpecFilter(''); setServiceFilter(''); }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Filter size={15} /> Clear Filters
          </button>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Doctor cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No doctors found"
          description="Try adjusting your search or filters" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(99,102,241,0.12)' }}
              className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card cursor-pointer transition-all"
              onClick={() => navigate(`/patient/book/${doc.id}`)}
            >
              {/* Avatar + name */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0 shadow-btn">
                  {doc.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{doc.name}</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400 font-medium">{doc.specialization}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500">{doc.rating?.toFixed(1) || 'New'}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={12} className="flex-shrink-0" />
                  <span className="truncate">{doc.hospitalName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} className="flex-shrink-0" />
                  <span>{doc.workingHoursStart} – {doc.workingHoursEnd}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{doc.fee}</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-bold rounded-xl shadow-btn hover:brightness-110 transition-all"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
