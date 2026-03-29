import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Shield, CheckCircle, Calendar, Users, Home, UtensilsCrossed } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import ImageCarousel from '../components/ui/ImageCarousel';
import { getRoomImage, getAvatar, ROOM_PLACEHOLDERS } from '../utils/constants';
import api from '../services/api';

function InfoPill({ icon: Icon, label, value, color = 'primary' }) {
  if (!value) return null;
  const colors = { primary: 'bg-primary/5', secondary: 'bg-secondary/5', emerald: 'bg-emerald-50', violet: 'bg-violet-50', amber: 'bg-amber-50' };
  return (
    <div className={`flex items-center gap-2.5 ${colors[color] || colors.primary} rounded-xl px-4 py-3`}>
      <Icon size={16} className="text-primary" />
      <div>
        <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm font-bold text-dark capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function PGDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((s) => s.auth);
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/pgs/${id}`).then((r) => setPg(r.data.data)).catch(() => navigate('/search?tab=pgs')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <MainLayout><div className="max-w-5xl mx-auto px-4 py-8"><div className="h-72 bg-white rounded-2xl animate-pulse mb-6" /><div className="h-40 bg-white rounded-2xl animate-pulse" /></div></MainLayout>
  );
  if (!pg) return null;

  const image = getRoomImage(pg._id, pg.images);
  const ownerAvatar = getAvatar(pg.postedBy?._id, pg.postedBy?.profileImage);
  const isOwn = authUser?._id === pg.postedBy?._id;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted text-sm cursor-pointer hover:text-dark">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <ShareButton title={pg.title} size="lg" />
            <SaveButton itemType="pg" itemId={pg._id} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <ImageCarousel images={pg.images?.length > 0 ? pg.images : [image, ...ROOM_PLACEHOLDERS.slice(0, 2)]} alt={pg.title} className="h-72" />
          </div>

          {/* Price + badges */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-dark">₹{pg.rent?.toLocaleString('en-IN')}</span>
              <span className="text-base text-muted">/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="primary">PG</Badge>
              {pg.gender && pg.gender !== 'unisex' && <Badge>{pg.gender}</Badge>}
              {pg.meals && <Badge color="secondary">Meals</Badge>}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h1 className="text-2xl font-extrabold text-dark mb-2">{pg.title}</h1>
                <p className="text-sm text-muted flex items-center gap-1"><MapPin size={14} className="text-primary" /> {pg.location}</p>
              </div>

              {/* Info pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoPill icon={Home} label="Sharing" value={pg.sharing} color="primary" />
                <InfoPill icon={Users} label="Gender" value={pg.gender} color="violet" />
                {pg.meals && <InfoPill icon={UtensilsCrossed} label="Meals" value={pg.mealType ? `${pg.mealType === 'veg' ? '🟢' : pg.mealType === 'non-veg' ? '🔴' : '🟡'} ${pg.mealType}` : 'Included'} color="emerald" />}
                {pg.availableFrom && <InfoPill icon={Calendar} label="Available" value={new Date(pg.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} color="amber" />}
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-dark mb-3">About this PG</h3>
                <p className="text-sm text-muted leading-relaxed">{pg.description}</p>
              </div>

              {/* Amenities */}
              {pg.amenities?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-dark mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pg.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2.5 bg-surface rounded-xl px-3 py-2.5">
                        <CheckCircle size={15} className="text-primary flex-shrink-0" />
                        <span className="text-sm text-dark capitalize">{a.replace(/-/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-dark mb-4">Posted by</h3>
                {pg.postedBy && (
                  <div className="flex items-center gap-3 mb-4">
                    <img src={ownerAvatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
                    <div>
                      <p className="font-semibold text-dark text-sm flex items-center gap-1.5">
                        {pg.postedBy.name}
                        {pg.postedBy.verified && <Shield size={14} className="text-primary" />}
                      </p>
                      <p className="text-xs text-muted">{pg.postedBy.city || pg.postedBy.phone}</p>
                    </div>
                  </div>
                )}
                {!isOwn ? (
                  <ContactButtons userId={pg.postedBy?._id} listingType="pg" listingId={pg._id} size="lg" />
                ) : (
                  <p className="text-xs text-muted text-center bg-surface rounded-xl py-2">This is your listing</p>
                )}
              </div>

              {/* PG Summary */}
              <div className="bg-surface rounded-2xl p-5">
                <h4 className="font-semibold text-dark text-sm mb-3">PG Summary</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Rent', value: `₹${pg.rent?.toLocaleString('en-IN')}/mo` },
                    { label: 'Deposit', value: pg.deposit ? `₹${pg.deposit?.toLocaleString('en-IN')}` : 'N/A' },
                    { label: 'Sharing', value: pg.sharing || 'N/A' },
                    { label: 'Gender', value: pg.gender || 'N/A' },
                    { label: 'Meals', value: pg.meals ? (pg.mealType || 'Included') : 'Not included' },
                    { label: 'City', value: pg.city || 'N/A' },
                    { label: 'Posted', value: new Date(pg.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-xs text-muted">{r.label}</span>
                      <span className="text-xs font-semibold text-dark capitalize">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-5">
                <h4 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2"><Shield size={16} className="text-primary" /> Safety Tips</h4>
                <ul className="text-xs text-muted space-y-2 leading-relaxed">
                  <li>• Visit the PG before paying</li>
                  <li>• Check meals, timings and house rules</li>
                  <li>• Use secure chat for communication</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
