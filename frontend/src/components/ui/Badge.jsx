const STATUS_CLASSES = {
  REQUESTED:  'badge-requested',
  ACCEPTED:   'badge-accepted',
  COMPLETED:  'badge-completed',
  REJECTED:   'badge-rejected',
  PENDING:    'badge-pending',
  APPROVED:   'badge-approved',
  FAILED:     'badge-failed',
  REFUNDED:   'badge-refunded',
};

export default function Badge({ status, label, className = '' }) {
  const cls = STATUS_CLASSES[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls} ${className}`}
    >
      {label || status}
    </span>
  );
}
