import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Shield, Calendar, IndianRupee, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import { getAvatar } from '../utils/constants';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function RoommateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((s) => s.auth);
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/requirements/${id}`).then((r) => setReq(r.data.data)).catch(() => navigate('/search?tab=roommates')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-40 bg-white rounded-2xl animate-pulse mb-6" />
        <div className="h-60 bg-white rounded-2xl animate-pulse" />
      </div>
    </MainLayout>
  );

  if (!req) return null;

  const poster = req.createdBy;
  const avatar = getAvatar(poster?._id, poster?.profileImage);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted text-sm mb-4 hover:text-dark cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm mb-5">
            <div className="flex items-start gap-4">
              <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-extrabold text-dark">{poster?.name || 'User'}</h1>
                  {poster?.verified && <Shield size={16} className="text-primary" />}
                  <ShareButton title={req.title} />
                  <SaveButton itemType="requirement" itemId={req._id} />
                </div>
                <p className="text-sm text-muted flex items-center gap-1"><MapPin size={13} /> {req.location || poster?.city}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge color="primary">{req.type === 'room' ? 'Looking for Room' : 'Looking for Flatmate'}</Badge>
                  {poster?.gender && <Badge>{poster.gender}</Badge>}
                </div>
              </div>
            </div>

            {authUser?._id !== poster?._id ? (
              <ContactButtons userId={poster?._id} listingType="requirement" listingId={req?._id} size="lg" className="mt-5" />
            ) : (
              <p className="text-xs text-muted text-center bg-surface rounded-xl py-2 mt-5">This is your listing</p>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm mb-5">
            <h2 className="font-bold text-dark mb-3">{req.title}</h2>
            {req.description && <p className="text-sm text-muted leading-relaxed mb-4">{req.description}</p>}

            <div className="grid grid-cols-2 gap-4">
              {req.budget && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Budget</p>
                  <p className="text-sm font-bold text-dark flex items-center gap-1">
                    <IndianRupee size={13} className="text-primary" />
                    {req.budget.min?.toLocaleString('en-IN')} – {req.budget.max?.toLocaleString('en-IN')}/mo
                  </p>
                </div>
              )}
              {req.moveInDate && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Move-in Date</p>
                  <p className="text-sm font-bold text-dark flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(req.moveInDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
              {req.preferredRoommate?.gender && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Preferred Gender</p>
                  <p className="text-sm font-bold text-dark capitalize">{req.preferredRoommate.gender}</p>
                </div>
              )}
              {req.preferredRoommate?.ageMin && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1">Age Range</p>
                  <p className="text-sm font-bold text-dark">{req.preferredRoommate.ageMin} – {req.preferredRoommate.ageMax} yrs</p>
                </div>
              )}
            </div>
          </div>

          {/* Lifestyle */}
          {req.lifestyle && (
            <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm mb-5">
              <h3 className="font-bold text-dark mb-3">Lifestyle</h3>
              <div className="flex flex-wrap gap-2">
                {req.lifestyle.smoking !== undefined && <Badge color={req.lifestyle.smoking ? 'secondary' : 'primary'}>{req.lifestyle.smoking ? 'Smoker' : 'Non-Smoker'}</Badge>}
                {req.lifestyle.drinking !== undefined && <Badge color={req.lifestyle.drinking ? 'secondary' : 'primary'}>{req.lifestyle.drinking ? 'Drinks' : 'Non-Drinker'}</Badge>}
                {req.lifestyle.pets !== undefined && <Badge color={req.lifestyle.pets ? 'primary' : 'secondary'}>{req.lifestyle.pets ? 'Pet Friendly' : 'No Pets'}</Badge>}
                {req.lifestyle.sleepSchedule && <Badge>{req.lifestyle.sleepSchedule}</Badge>}
              </div>
            </div>
          )}

          {/* Notes */}
          {req.notes && (
            <div className="bg-surface rounded-2xl p-5">
              <h3 className="font-semibold text-dark text-sm mb-2">Additional Notes</h3>
              <p className="text-sm text-muted leading-relaxed">{req.notes}</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
