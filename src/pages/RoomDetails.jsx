import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, Shield, CheckCircle, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import ImageCarousel from '../components/ui/ImageCarousel';
import { fetchRoomById, clearCurrentRoom } from '../redux/slices/roomSlice';
import { getRoomImage, getAvatar, ROOM_PLACEHOLDERS } from '../utils/constants';

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
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-32 w-full" />
            </div>
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
        {/* Back + actions bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted hover:text-dark transition-colors cursor-pointer">
            <ArrowLeft size={18} /> Back to listings
          </button>
          <ShareButton title={room?.title} size="lg" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Image carousel */}
          <div className="mb-6">
            <ImageCarousel images={room.images?.length > 0 ? room.images : [mainImage, ...ROOM_PLACEHOLDERS.slice(0, 2)]} alt={room.title} className="h-72 sm:h-96" />
          </div>

          {/* Price + save row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-dark">₹{room.rent?.toLocaleString('en-IN')}<span className="text-base font-normal text-muted">/month</span></span>
              {room.deposit > 0 && <span className="text-sm text-muted bg-surface px-3 py-1 rounded-lg">Deposit: ₹{room.deposit?.toLocaleString('en-IN')}</span>}
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={room.title} size="lg" />
              <SaveButton itemType="room" itemId={room._id} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-dark mb-2">{room.title}</h1>
                <div className="flex items-center gap-2 text-muted">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm">{room.location}</span>
                </div>
              </div>

              {/* Quick info pills */}
              <div className="flex flex-wrap gap-3">
                {room.availableFrom && (
                  <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-2.5">
                    <Calendar size={16} className="text-primary" />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Available</p>
                      <p className="text-sm font-semibold text-dark">{new Date(room.availableFrom).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}
                {room.preferredTenant && room.preferredTenant !== 'any' && (
                  <div className="flex items-center gap-2 bg-secondary/5 rounded-xl px-4 py-2.5">
                    <User size={16} className="text-secondary" />
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">Preferred</p>
                      <p className="text-sm font-semibold text-dark capitalize">{room.preferredTenant}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-dark mb-3">About this place</h3>
                <p className="text-muted text-sm leading-relaxed">{room.description}</p>
              </div>

              {room.amenities?.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-dark mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-sm text-muted">
                        <CheckCircle size={16} className="text-primary" />
                        <span className="capitalize">{a}</span>
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
                {room.postedBy && (
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
                )}
                {!isOwn && <ContactButtons userId={room.postedBy?._id} listingType="room" listingId={room._id} size="lg" className="mb-2" />}
                {isOwn && <p className="text-xs text-muted text-center bg-surface rounded-xl py-2">This is your listing</p>}
              </div>

              {/* Safety card */}
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
