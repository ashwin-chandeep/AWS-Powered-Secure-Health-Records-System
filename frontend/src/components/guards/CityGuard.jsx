import { Navigate } from 'react-router-dom';
import { useCityStore } from '../../store/cityStore';

export default function CityGuard({ children }) {
  const city = useCityStore((s) => s.city);
  if (!city) return <Navigate to="/select-city" replace />;
  return children;
}
