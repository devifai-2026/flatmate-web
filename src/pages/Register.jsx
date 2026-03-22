import { Navigate } from 'react-router-dom';

// Register and Login are the same flow now — phone OTP decides new vs existing
export default function Register() {
  return <Navigate to="/login" replace />;
}
