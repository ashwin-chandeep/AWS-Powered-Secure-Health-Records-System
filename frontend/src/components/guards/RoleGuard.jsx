import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function RoleGuard({ role, children }) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
