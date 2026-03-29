import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, Shield, CheckCircle, User, Home, Layers, Car, Bath, Ruler, Building2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import ImageCarousel from '../components/ui/ImageCarousel';
import { fetchRoomById, clearCurrentRoom } from '../redux/slices/roomSlice';
import { getRoomImage, getAvatar, ROOM_PLACEHOLDERS } from '../utils/constants';

function InfoPill({ icon: Icon, label, value, color = 'primary' }) {
  if (!value) return null;
  const colors = { primary: 'bg-primary/5 text-primary', secondary: 'bg-secondary/5 text-secondary', emerald: 'bg-emerald-50 text-emerald-600', violet: 'bg-violet-50 text-violet-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className={`flex items-center gap-2.5 ${colors[color] || colors.primary} rounded-xl px-4 py-3`}>
      <Icon size={16} />
      <div>
        <p className="text-[9px] text-muted uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm font-bold text-dark capitalize">{value}</p>
      </div>
    </div>
  );
}

export default function RoomDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: room, loading } = useSelector((s) => s.rooms);
  const { user: authUser } = useSelector((s) => s.auth);
  const isOwn = authUser?._id && room?.postedBy?._id && authUser._id === room.postedBy._id;

  useEffect(() => {
    dispatch(fetchRoomById(id));
    return () => { dispatch(clearCurrentRoom()); };
  }, [id, dispatch]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-32 w-full" /></div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!room) return <MainLayout><div className="max-w-5xl mx-auto px-4 py-8 text-center text-muted">Room not found</div></MainLayout>;

  const mainImage = getRoomImage(room._id, room.images);
  const ownerAvatar = room.postedBy ? getAvatar(room.postedBy._id, room.postedBy.profileImage) : null;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + actions */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-dark transition-colors cursor-pointer">
            <ArrowLeft size={18} /> Back
          </button>
          <div className="flex items-center gap-2">
            <ShareButton title={room?.title} size="lg" />
            <SaveButton itemType="room" itemId={room._id} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image carousel */}
          <div className="mb-6">
            <ImageCarousel images={room.images?.length > 0 ? room.images : [mainImage, ...ROOM_PLACEHOLDERS.slice(0, 2)]} alt={room.title} className="h-72 sm:h-96" />
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-dark">₹{room.rent?.toLocaleString('en-IN')}</span>
              <span className="text-base text-muted">/month</span>
            </div>
            <div className="flex items-center gap-2">
              {room.deposit > 0 && <span className="text-sm text-muted bg-surface px-3 py-1.5 rounded-lg font-medium">Deposit: ₹{room.deposit?.toLocaleString('en-IN')}</span>}
              {room.roomType && <Badge color="primary">{room.roomType.toUpperCase()}</Badge>}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main details */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h1 className="text-2xl font-extrabold text-dark mb-2">{room.title}</h1>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm">{room.location}</span>
                </div>
              </div>

              {/* Quick info pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoPill icon={Calendar} label="Available" value={room.availableFrom ? new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : null} />
                <InfoPill icon={User} label="Preferred Tenant" value={room.preferredTenant !== 'any' ? room.preferredTenant?.replace(/-/g, ' ') : null} color="secondary" />
                <InfoPill icon={Home} label="Furnishing" value={room.furnishing?.replace(/-/g, ' ')} color="emerald" />
                <InfoPill icon={Bath} label="Bathrooms" value={room.bathrooms ? `${room.bathrooms} bathroom${room.bathrooms > 1 ? 's' : ''}` : null} color="violet" />
                <InfoPill icon={Ruler} label="Area" value={room.totalArea ? `${room.totalArea} sq ft` : null} color="amber" />
                <InfoPill icon={Building2} label="Floor" value={room.floor ? `${room.floor} floor` : null} />
                <InfoPill icon={Car} label="Parking" value={room.parking && room.parking !== 'none' ? room.parking : null} color="secondary" />
                <InfoPill icon={Layers} label="Room Type" value={room.roomType?.replace(/-/g, ' ')?.toUpperCase()} color="violet" />
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-dark mb-3">About this place</h3>
                <p className="text-muted text-sm leading-relaxed">{room.description}</p>
              </div>

              {/* Amenities */}
              {room.amenities?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-dark mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map((a) => (
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
              {/* Owner card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-dark mb-4">Posted by</h3>
                {room.postedBy ? (
                  <div className="flex items-center gap-3 mb-5">
                    <img src={ownerAvatar} alt={room.postedBy.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" loading="lazy" />
                    <div className="flex-1">
                      <p className="font-semibold text-dark text-sm flex items-center gap-1.5">
                        {room.postedBy.name}
                        {room.postedBy.verified && <Shield size={14} className="text-primary" />}
                      </p>
                      <p className="text-xs text-muted">{room.postedBy.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted mb-4">Owner info not available</p>
                )}
                {!isOwn && <ContactButtons userId={room.postedBy?._id} listingType="room" listingId={room._id} size="lg" className="mb-2" />}
                {isOwn && <p className="text-xs text-muted text-center bg-surface rounded-xl py-2">This is your listing</p>}
              </div>

              {/* Room summary card */}
              <div className="bg-surface rounded-2xl p-5">
                <h4 className="font-semibold text-dark text-sm mb-3">Room Summary</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Rent', value: `₹${room.rent?.toLocaleString('en-IN')}/mo` },
                    { label: 'Deposit', value: room.deposit ? `₹${room.deposit?.toLocaleString('en-IN')}` : 'N/A' },
                    { label: 'Type', value: room.roomType?.replace(/-/g, ' ')?.toUpperCase() || 'N/A' },
                    { label: 'Furnishing', value: room.furnishing?.replace(/-/g, ' ') || 'N/A' },
                    { label: 'Parking', value: room.parking?.replace(/-/g, ' ') || 'None' },
                    { label: 'Posted', value: new Date(room.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span className="text-xs text-muted">{r.label}</span>
                      <span className="text-xs font-semibold text-dark capitalize">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety tips */}
              <div className="bg-surface rounded-2xl p-5">
                <h4 className="font-semibold text-dark text-sm mb-3 flex items-center gap-2"><Shield size={16} className="text-primary" /> Safety Tips</h4>
                <ul className="text-xs text-muted space-y-2 leading-relaxed">
                  <li>• Always verify the property in person</li>
                  <li>• Never pay advance without a proper agreement</li>
                  <li>• Use our secure chat for communication</li>
                  <li>• Report suspicious listings</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
