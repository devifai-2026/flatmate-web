import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Shield, Calendar, IndianRupee, User, Briefcase, Heart, UtensilsCrossed, Moon, Sparkles, Home } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import ImageCarousel from '../components/ui/ImageCarousel';
import { getAvatar, LIFESTYLE_TAGS } from '../utils/constants';
import api from '../services/api';

function DetailRow({ icon: Icon, label, value, color = 'primary' }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3">
      <Icon size={15} className={`text-${color} flex-shrink-0`} />
      <div>
        <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm font-bold text-dark capitalize">{value}</p>
      </div>
    </div>
  );
}

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
    <MainLayout><div className="max-w-3xl mx-auto px-4 py-8"><div className="h-40 bg-white rounded-2xl animate-pulse mb-6" /><div className="h-60 bg-white rounded-2xl animate-pulse" /></div></MainLayout>
  );
  if (!req) return null;

  const poster = req.createdBy;
  const avatar = getAvatar(poster?._id, poster?.profileImage);
  const isOwn = authUser?._id === poster?._id;

  const foodIcon = req.foodPreference === 'veg' ? '🟢' : req.foodPreference === 'non-veg' ? '🔴' : req.foodPreference === 'vegan' ? '🌿' : '🟡';
  const matchedTags = (req.lifestyleTags || []).map((id) => LIFESTYLE_TAGS.find((t) => t.id === id)).filter(Boolean);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted text-sm cursor-pointer hover:text-dark">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <ShareButton title={req.title} />
            <SaveButton itemType="requirement" itemId={req._id} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Images if any */}
          {req.images?.length > 0 && (
            <div className="mb-5">
              <ImageCarousel images={req.images} alt={req.title} className="h-56 sm:h-72" />
            </div>
          )}

          {/* Profile header */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5">
            <div className="flex items-start gap-4">
              <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg font-extrabold text-dark">{poster?.name || 'User'}</h1>
                  {poster?.verified && <Shield size={16} className="text-primary" />}
                </div>
                <p className="text-sm text-muted flex items-center gap-1"><MapPin size={13} className="text-primary" /> {req.location || poster?.city}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {req.gender && <Badge>{req.gender}</Badge>}
                  {req.age && <Badge color="gray">{req.age} yrs</Badge>}
                  {req.occupation && <Badge color="primary">{req.occupation.replace(/-/g, ' ')}</Badge>}
                  {req.religion && req.religion !== 'no-preference' && <Badge color="secondary">{req.religion}</Badge>}
                </div>
              </div>
            </div>

            {!isOwn ? (
              <ContactButtons userId={poster?._id} listingType="requirement" listingId={req?._id} size="lg" className="mt-5" />
            ) : (
              <p className="text-xs text-muted text-center bg-surface rounded-xl py-2 mt-5">This is your listing</p>
            )}
          </div>

          {/* Title + Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-5">
            <h2 className="font-bold text-dark mb-2">{req.title}</h2>
            {req.description && <p className="text-sm text-muted leading-relaxed">{req.description}</p>}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {req.budget && (
              <DetailRow icon={IndianRupee} label="Budget" value={`₹${req.budget.min?.toLocaleString('en-IN')} – ${req.budget.max?.toLocaleString('en-IN')}/mo`} />
            )}
            {req.moveInDate && (
              <DetailRow icon={Calendar} label="Move-in Date" value={new Date(req.moveInDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} />
            )}
            {req.roomType && (
              <DetailRow icon={Home} label="Room Type" value={req.roomType} />
            )}
            {req.foodPreference && req.foodPreference !== 'no-preference' && (
              <DetailRow icon={UtensilsCrossed} label="Food" value={`${foodIcon} ${req.foodPreference}`} />
            )}
            {req.occupation && (
              <DetailRow icon={Briefcase} label="Occupation" value={req.occupation.replace(/-/g, ' ')} />
            )}
            {req.languages?.length > 0 && (
              <DetailRow icon={User} label="Languages" value={req.languages.join(', ')} />
            )}
          </div>

          {/* Preferred Roommate */}
          {req.preferredRoommate && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-5">
              <h3 className="font-bold text-dark mb-3 flex items-center gap-2"><Heart size={16} className="text-primary" /> Looking For</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {req.preferredRoommate.gender && req.preferredRoommate.gender !== 'any' && (
                  <div className="bg-surface rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[9px] text-muted uppercase font-semibold">Gender</p>
                    <p className="text-sm font-bold text-dark capitalize">{req.preferredRoommate.gender}</p>
                  </div>
                )}
                {req.preferredRoommate.ageMin && (
                  <div className="bg-surface rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[9px] text-muted uppercase font-semibold">Age Range</p>
                    <p className="text-sm font-bold text-dark">{req.preferredRoommate.ageMin} – {req.preferredRoommate.ageMax} yrs</p>
                  </div>
                )}
                {req.preferredRoommate.religion && (
                  <div className="bg-surface rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[9px] text-muted uppercase font-semibold">Religion</p>
                    <p className="text-sm font-bold text-dark capitalize">{req.preferredRoommate.religion}</p>
                  </div>
                )}
                {req.preferredRoommate.foodPreference && (
                  <div className="bg-surface rounded-xl px-3 py-2.5 text-center">
                    <p className="text-[9px] text-muted uppercase font-semibold">Food Pref.</p>
                    <p className="text-sm font-bold text-dark capitalize">{req.preferredRoommate.foodPreference}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lifestyle */}
          {req.lifestyle && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-5">
              <h3 className="font-bold text-dark mb-3 flex items-center gap-2"><Moon size={16} className="text-primary" /> Lifestyle</h3>
              <div className="flex flex-wrap gap-2">
                {req.lifestyle.smoking !== undefined && <Badge color={req.lifestyle.smoking ? 'secondary' : 'primary'}>{req.lifestyle.smoking ? '🚬 Smoker' : '🚭 Non-Smoker'}</Badge>}
                {req.lifestyle.drinking !== undefined && <Badge color={req.lifestyle.drinking ? 'secondary' : 'primary'}>{req.lifestyle.drinking ? '🍷 Drinks' : '🚫 Non-Drinker'}</Badge>}
                {req.lifestyle.pets !== undefined && <Badge color={req.lifestyle.pets ? 'primary' : 'secondary'}>{req.lifestyle.pets ? '🐾 Pet Friendly' : 'No Pets'}</Badge>}
                {req.lifestyle.sleepSchedule && <Badge>{req.lifestyle.sleepSchedule === 'early-bird' ? '🌅' : req.lifestyle.sleepSchedule === 'night-owl' ? '🦉' : '🔄'} {req.lifestyle.sleepSchedule.replace(/-/g, ' ')}</Badge>}
                {req.lifestyle.cleanliness && <Badge>{req.lifestyle.cleanliness === 'very-clean' ? '✨' : req.lifestyle.cleanliness === 'moderate' ? '👍' : '😎'} {req.lifestyle.cleanliness.replace(/-/g, ' ')}</Badge>}
                {req.lifestyle.guests && <Badge>Guests: {req.lifestyle.guests}</Badge>}
              </div>
            </div>
          )}

          {/* Lifestyle Tags */}
          {matchedTags.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-5">
              <h3 className="font-bold text-dark mb-3 flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Interests & Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {matchedTags.map((tag) => (
                  <span key={tag.id} className="inline-flex items-center gap-1 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-lg border border-primary/10">
                    {tag.emoji} {tag.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {req.notes && (
            <div className="bg-surface rounded-2xl p-5 mb-5">
              <h3 className="font-semibold text-dark text-sm mb-2">Additional Notes</h3>
              <p className="text-sm text-muted leading-relaxed">{req.notes}</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
