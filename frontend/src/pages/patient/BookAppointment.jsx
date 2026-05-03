import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Star, ChevronLeft, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorById } from '../../api/doctorApi';
import { getServices } from '../../api/serviceApi';
import { createAppointment } from '../../api/appointmentApi';
import { initiatePayment } from '../../api/paymentApi';
import { useAuthStore } from '../../store/authStore';
import { useCityStore } from '../../store/cityStore';
import Button from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/Skeleton';

function generateSlots(start, end, intervalMin, date) {
  const slots = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (cur + intervalMin <= endMin) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    const dt = new Date(date);
    dt.setHours(h, m, 0, 0);
    slots.push(dt.toISOString());
    cur += intervalMin;
  }
  return slots;
}

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { city } = useCityStore();

  const [doctor, setDoctor] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    Promise.all([getDoctorById(doctorId), getServices(city)])
      .then(([docRes, svcRes]) => {
        setDoctor(docRes.data);
        setServices(svcRes.data);
      })
      .catch(() => toast.error('Failed to load doctor info'))
      .finally(() => setLoading(false));
  }, [doctorId, city]);

  const slots = doctor
    ? generateSlots(doctor.workingHoursStart || '09:00', doctor.workingHoursEnd || '17:00',
        doctor.slotIntervalMinutes || 30, date)
    : [];

  const handleBook = async () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    if (!selectedService) { toast.error('Please select a service'); return; }
    setBooking(true);
    try {
      const aptPayload = {
        city, patientId: Number(user.id), patientName: user.name,
        doctorId: Number(doctorId), doctorName: doctor.name,
        hospitalName: doctor.hospitalName, specialization: doctor.specialization,
        serviceId: Number(selectedService.id), serviceName: selectedService.name,
        slotIso: selectedSlot,
      };
      const { data: apt } = await createAppointment(aptPayload);
      // Initiate payment
      await initiatePayment({
        appointmentId: apt.id, patientId: Number(user.id), doctorId: Number(doctorId),
        patientName: user.name, doctorName: doctor.name,
        serviceName: selectedService.name, amount: doctor.fee,
      });
      toast.success('Appointment requested successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <SkeletonCard /><SkeletonCard />
    </div>
  );
  if (!doctor) return <div className="text-slate-500 text-center py-12">Doctor not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 font-medium transition-colors">
        <ChevronLeft size={16} /> Back to Search
      </button>

      {/* Doctor card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-6 shadow-card">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-2xl font-bold text-white shadow-btn">
            {doctor.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{doctor.name}</h2>
            <p className="text-brand-600 dark:text-brand-400 font-semibold">{doctor.specialization}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={11} />{doctor.hospitalName}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{doctor.workingHoursStart} – {doctor.workingHoursEnd}</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" />{doctor.rating?.toFixed(1) || 'New'}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{doctor.fee}</p>
            <p className="text-xs text-slate-500">per visit</p>
          </div>
        </div>
      </motion.div>

      {/* Service selection */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Stethoscope size={16} className="text-brand-500" /> Select Service
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {services.map((svc) => (
            <button key={svc.id} onClick={() => setSelectedService(svc)}
              className={`px-3 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all
                ${selectedService?.id === svc.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'}`}>
              {svc.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Date picker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-brand-500" /> Select Date
        </h3>
        <input type="date" className="input-base" min={today}
          value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} />
      </motion.div>

      {/* Slot picker */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-900 rounded-xl2 border border-slate-100 dark:border-slate-800 p-5 shadow-card">
        <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock size={16} className="text-brand-500" /> Available Slots
        </h3>
        {slots.length === 0 ? (
          <p className="text-sm text-slate-500">No slots available for selected date</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => {
              const t = new Date(slot);
              const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <button key={slot} onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-xl border text-sm font-semibold transition-all
                    ${selectedSlot === slot
                      ? 'border-brand-500 bg-brand-600 text-white shadow-btn'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300 hover:bg-brand-50'}`}>
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Book button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <Button variant="primary" size="lg" className="w-full" onClick={handleBook} loading={booking}
          disabled={!selectedSlot || !selectedService}>
          Confirm Booking — ₹{doctor.fee}
        </Button>
      </motion.div>
    </div>
  );
}
