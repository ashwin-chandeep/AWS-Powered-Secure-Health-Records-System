import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPatientPayments, completePayment } from '../../api/paymentApi';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function PatientPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getPatientPayments();
      setPayments(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso)));
    } catch { toast.error('Failed to load payments'); }
    finally { setLoading(false); }
  };

  const handlePay = async (p) => {
    if (!confirm(`Confirm payment of ₹${p.amount} for ${p.serviceName}?`)) return;
    try {
      await completePayment(p.id, 'CARD');
      toast.success('Payment successful!');
      load();
    } catch { toast.error('Payment failed'); }
  };

  const exportCsv = () => {
    const header = ['Date', 'Doctor', 'Service', 'Status', 'Amount'];
    const lines = [header.join(',')];
    filtered.forEach(p => {
      lines.push([
        new Date(p.createdAtIso).toLocaleDateString(),
        `"${p.doctorName}"`, `"${p.serviceName}"`, p.status, p.amount
      ].join(','));
    });
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'payments.csv'; a.click();
  };

  const filtered = statusFilter ? payments.filter((p) => p.status === statusFilter) : payments;
  const dueTotal = payments.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amount, 0);
  const paidTotal = payments.filter(p => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Payments</h1>
          <p className="text-slate-500 mt-0.5">Manage your consultation invoices</p>
        </div>
        <div className="flex gap-2">
          <select className="input-base w-32" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <Button variant="secondary" onClick={exportCsv}><Download size={16} /> CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CreditCard} label="Total Due" value={`₹${dueTotal}`} color="rose" />
        <StatCard icon={CreditCard} label="Total Paid" value={`₹${paidTotal}`} color="emerald" />
        <StatCard icon={CreditCard} label="Invoices" value={payments.length} color="brand" />
      </div>

      {loading ? <SkeletonTable /> : filtered.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments" description="You have no payment records matching the criteria." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl3 shadow-card border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Doctor / Service</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td className="p-4 text-sm text-slate-500">{new Date(p.createdAtIso).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">
                      <div className="font-bold text-slate-900 dark:text-white">{p.doctorName}</div>
                      <div className="text-slate-500 text-xs">{p.serviceName}</div>
                    </td>
                    <td className="p-4"><Badge status={p.status} /></td>
                    <td className="p-4 text-sm font-extrabold text-slate-900 dark:text-white text-right">₹{p.amount}</td>
                    <td className="p-4 text-right">
                      {p.status === 'PENDING' && (
                        <Button variant="primary" size="sm" onClick={() => handlePay(p)}>Pay Now</Button>
                      )}
                    </td>
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
