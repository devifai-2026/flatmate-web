import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, Users, Building2, MapPin, Trash2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { fetchWishlist, toggleSave } from '../redux/slices/wishlistSlice';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import ContactButtons from '../components/ui/ContactButtons';
import { getRoomImage, getAvatar } from '../utils/constants';

function SavedItemCard({ item, onRemove }) {
  const { itemType, data } = item;
  if (!data) return null;

  const typeLabel = { room: 'Room', pg: 'PG', roommate: 'Roommate', requirement: 'Looking for' };
  const typeIcon = { room: Home, pg: Building2, roommate: Users, requirement: Users };
  const Icon = typeIcon[itemType] || Home;

  const image = itemType === 'room' || itemType === 'pg'
    ? getRoomImage(data._id, data.images)
    : getAvatar(data._id || data.createdBy?._id, data.profileImage || data.createdBy?.profileImage);

  const title = data.title || data.name || data.createdBy?.name || 'Untitled';
  const location = data.location || data.city || data.createdBy?.city || '';
  const price = data.rent || data.budget?.max;

  const detailUrl = itemType === 'room' ? `/rooms/${data._id}` : itemType === 'pg' ? `/pgs/${data._id}` : `/roommates/${data._id}`;
  const ownerId = data.postedBy?._id || data.postedBy || data.createdBy?._id || data.createdBy;
  const ownerPhone = data.contactPhone || data.postedBy?.phone || data.createdBy?.phone;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-dark/6 shadow-sm hover:shadow-md transition-all flex overflow-hidden group">
      <Link to={detailUrl} className="w-28 h-28 flex-shrink-0 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Icon size={9} /> {typeLabel[itemType]}
            </span>
          </div>
          <Link to={detailUrl}>
            <h3 className="text-sm font-semibold text-dark line-clamp-1 hover:text-primary transition-colors">{title}</h3>
          </Link>
          {location && <p className="text-xs text-muted flex items-center gap-1 mt-0.5"><MapPin size={10} /> {location}</p>}
        </div>
        {price && <p className="text-sm font-bold text-dark mt-1">₹{price.toLocaleString('en-IN')}<span className="text-xs text-muted font-normal">/mo</span></p>}
        <div className="flex items-center gap-1.5 mt-2">
          <Link to={detailUrl} className="flex-1">
            <button className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all cursor-pointer">View Details</button>
          </Link>
          <ContactButtons userId={ownerId} listingType={itemType} listingId={data._id} />
          <button onClick={() => onRemove(itemType, data._id || item.itemId)}
            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 cursor-pointer transition-colors" title="Remove">
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Saved() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleRemove = (itemType, itemId) => {
    dispatch(toggleSave({ itemType, itemId }));
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Heart size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-dark">Saved Items</h1>
            <p className="text-xs text-muted">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0,1,2].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={Heart} title="No saved items yet" description="Save rooms, PGs, and roommates to view them here.">
            <Link to="/search"><Button size="sm" className="rounded-xl mt-3">Browse Listings</Button></Link>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <SavedItemCard key={item._id || i} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
