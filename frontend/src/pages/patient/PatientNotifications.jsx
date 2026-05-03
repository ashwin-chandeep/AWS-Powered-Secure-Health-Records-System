import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNotifications, markAllRead } from '../../api/notificationApi';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonTable } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications();
      setNotifications(data.sort((a, b) => b.createdAtIso.localeCompare(a.createdAtIso)));
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch { toast.error('Action failed'); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
            <CheckCircle size={16} /> Mark all read
          </Button>
        )}
      </div>

      {loading ? <SkeletonTable rows={4} /> : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="All caught up!" description="You have no notifications." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div key={notif.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`p-4 rounded-xl2 border transition-all ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  : 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800/50 shadow-sm'
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.read ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' : 'bg-brand-100 text-brand-600 dark:bg-brand-800 dark:text-brand-300'
                }`}>
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-semibold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(notif.createdAtIso).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {notif.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
