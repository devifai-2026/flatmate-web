import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Shield, CheckCircle, Calendar } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import ImageCarousel from '../components/ui/ImageCarousel';
import { getRoomImage, getAvatar, ROOM_PLACEHOLDERS } from '../utils/constants';
import api from '../services/api';
import { useSelector } from 'react-redux';

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
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="h-72 bg-white rounded-2xl animate-pulse mb-6" />
        <div className="h-40 bg-white rounded-2xl animate-pulse" />
      </div>
    </MainLayout>
  );

  if (!pg) return null;

  const image = getRoomImage(pg._id, pg.images);
  const ownerAvatar = getAvatar(pg.postedBy?._id, pg.postedBy?.profileImage);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted text-sm mb-4 hover:text-dark cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image carousel */}
          <div className="mb-6">
            <ImageCarousel images={pg.images?.length > 0 ? pg.images : [image, ...ROOM_PLACEHOLDERS.slice(0, 2)]} alt={pg.title} className="h-72" />
          </div>

          {/* Price + save row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-dark">₹{pg.rent?.toLocaleString('en-IN')}<span className="text-base font-normal text-muted">/month</span></span>
              <Badge color="primary">PG</Badge>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={pg.title} size="lg" />
              <SaveButton itemType="pg" itemId={pg._id} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-xl font-extrabold text-dark">{pg.title}</h1>
                    <p className="text-sm text-muted flex items-center gap-1 mt-1"><MapPin size={14} /> {pg.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-primary">₹{pg.rent?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted">/month</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pg.gender && <Badge>{pg.gender}</Badge>}
                  {pg.sharing && <Badge color="secondary">{pg.sharing}</Badge>}
                  {pg.meals && <Badge color="primary">Meals Included</Badge>}
                </div>

                {pg.description && <p className="text-sm text-muted leading-relaxed mb-4">{pg.description}</p>}

                {pg.availableFrom && (
                  <p className="text-xs text-muted flex items-center gap-1.5"><Calendar size={13} /> Available from {new Date(pg.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                )}
              </div>

              {pg.amenities?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm">
                  <h3 className="font-bold text-dark mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {pg.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircle size={14} className="text-primary" />
                        <span className="capitalize">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-dark/6 shadow-sm">
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
                {authUser?._id !== pg.postedBy?._id ? (
                  <ContactButtons userId={pg.postedBy?._id} listingType="pg" listingId={pg._id} size="lg" />
                ) : (
                  <p className="text-xs text-muted text-center bg-surface rounded-xl py-2">This is your listing</p>
                )}
              </div>

              <div className="bg-surface rounded-2xl p-5">
                <h4 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2"><Shield size={16} className="text-primary" /> Safety Tips</h4>
                <ul className="text-xs text-muted space-y-2 leading-relaxed">
                  <li>• Visit the PG before paying</li>
                  <li>• Check meals and timings</li>
                  <li>• Verify house rules</li>
                  <li>• Use secure chat</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
