import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProtectedRoute from './components/ui/ProtectedRoute'
import { fetchSavedIds } from './redux/slices/wishlistSlice'
import { fetchProfile } from './redux/slices/userSlice'
import { fetchBalance, fetchUnlockedIds } from './redux/slices/walletSlice'
import { trackPageView } from './services/guestTracker'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Search = lazy(() => import('./pages/Search'))
const RoomDetails = lazy(() => import('./pages/RoomDetails'))
const PGDetails = lazy(() => import('./pages/PGDetails'))
const RoommateDetails = lazy(() => import('./pages/RoommateDetails'))
const PostListing = lazy(() => import('./pages/PostListing'))
const Discover = lazy(() => import('./pages/Discover'))
const Chat = lazy(() => import('./pages/Chat'))
const Profile = lazy(() => import('./pages/Profile'))
const Saved = lazy(() => import('./pages/Saved'))
const Teams = lazy(() => import('./pages/Teams'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Preferences = lazy(() => import('./pages/Preferences'))
const Wallet = lazy(() => import('./pages/Wallet'))
const ManageListings = lazy(() => import('./pages/ManageListings'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Support = lazy(() => import('./pages/Support'))
const Refer = lazy(() => import('./pages/Refer'))
const Offers = lazy(() => import('./pages/Offers'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      dispatch(fetchSavedIds());
      dispatch(fetchProfile());
      dispatch(fetchBalance());
      dispatch(fetchUnlockedIds());
    }
  }, [token, dispatch]);

  // Track guest page views
  useEffect(() => {
    if (!token) {
      trackPageView(location.pathname);
    }
  }, [location.pathname, token]);
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/pgs/:id" element={<PGDetails />} />
        <Route path="/roommates/:id" element={<RoommateDetails />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><PostListing /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><ManageListings /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/refer" element={<ProtectedRoute><Refer /></ProtectedRoute>} />
        <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
