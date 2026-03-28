import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Force onboarding if profile is incomplete (but don't loop on /onboarding itself)
  if (user && user.onboardingComplete === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
