import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CreditCard, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDoctorPayments } from '../../api/paymentApi';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function DoctorEarnings() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorPayments()
      .then(({ data }) => setPayments(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso))))
      .catch(() => toast.error('Failed to load earnings'))
      .finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const header = ['Date', 'Patient', 'Service', 'Status', 'Amount'];
    const lines = [header.join(',')];
    payments.forEach(p => {
      lines.push([
        new Date(p.createdAtIso).toLocaleDateString(),
        `"${p.patientName}"`, `"${p.serviceName}"`, p.status, p.amount
      ].join(','));
    });
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'earnings.csv'; a.click();
  };

  const totalEarned = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Earnings</h1>
          <p className="text-slate-500 mt-0.5">Track your consultation revenue</p>
        </div>
        <Button variant="secondary" onClick={exportCsv}><Download size={16} /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Earned" value={`₹${totalEarned}`} color="emerald" />
        <StatCard icon={CreditCard} label="Pending Revenue" value={`₹${totalPending}`} color="amber" />
        <StatCard icon={CreditCard} label="Total Consultations" value={payments.length} color="brand" />
      </div>

      {loading ? <SkeletonTable /> : payments.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No earnings yet" description="Your payments will appear here once patients book consultations." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Patient</th>
                  <th className="p-4 font-semibold">Service</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="p-4 text-sm text-slate-500">{new Date(p.createdAtIso).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{p.patientName}</td>
                    <td className="p-4 text-sm text-slate-500">{p.serviceName}</td>
                    <td className="p-4 text-sm font-extrabold text-slate-900 dark:text-white text-right">₹{p.amount}</td>
                    <td className="p-4 text-right"><Badge status={p.status} /></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
