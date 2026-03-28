import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Users, Trash2, Edit3, Eye, MapPin, IndianRupee, Plus, Package, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import api from '../services/api';

const TABS = [
  { id: 'rooms', label: 'Rooms', icon: Home },
  { id: 'pgs', label: 'PGs', icon: Building2 },
  { id: 'requirements', label: 'Requirements', icon: Users },
];

function DeleteModal({ open, onClose, onConfirm, title }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-dark">Delete Listing</h3>
              <p className="text-xs text-muted">This action cannot be undone</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">Are you sure you want to delete <strong className="text-dark">"{title}"</strong>? All unlock records will also be removed.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-muted hover:bg-gray-50 transition-colors cursor-pointer">Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer">Delete</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ListingCard({ item, type, onDelete, onEdit, onView }) {
  const image = item.images?.[0];
  const price = type === 'requirement' ? `₹${item.budget?.min?.toLocaleString('en-IN')} – ${item.budget?.max?.toLocaleString('en-IN')}` : `₹${item.rent?.toLocaleString('en-IN')}/mo`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-44 h-36 sm:h-auto flex-shrink-0 bg-surface overflow-hidden">
          {image ? (
            <img src={image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={32} className="text-muted/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-dark text-sm truncate">{item.title}</h3>
              <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {item.location || item.city || '—'}
              </p>
            </div>
            <span className="text-sm font-extrabold text-primary whitespace-nowrap">{price}</span>
          </div>

          {item.description && (
            <p className="text-xs text-muted line-clamp-2 mb-3">{item.description}</p>
          )}

          <div className="mt-auto flex items-center justify-between">
            {/* Unlock count */}
            <div className="flex items-center gap-1.5 bg-primary/5 rounded-lg px-3 py-1.5">
              <Eye size={14} className="text-primary" />
              <span className="text-xs font-bold text-primary">{item.unlockCount || 0}</span>
              <span className="text-[10px] text-muted">unlocks</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => onView(item, type)} className="p-2 rounded-xl hover:bg-surface transition-colors cursor-pointer" title="View">
                <Eye size={16} className="text-muted" />
              </button>
              <button onClick={() => onEdit(item, type)} className="p-2 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer" title="Edit">
                <Edit3 size={16} className="text-primary" />
              </button>
              <button onClick={() => onDelete(item, type)} className="p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer" title="Delete">
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>

          {/* Date */}
          <p className="text-[10px] text-muted mt-2">Posted {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ManageListings() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('rooms');
  const [data, setData] = useState({ rooms: [], pgs: [], requirements: [] });
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    api.get('/listings/mine')
      .then((r) => setData(r.data.data || { rooms: [], pgs: [], requirements: [] }))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchListings(); }, []);

  const handleView = (item, type) => {
    if (type === 'room') navigate(`/rooms/${item._id}`);
    else if (type === 'pg') navigate(`/pgs/${item._id}`);
    else navigate(`/roommates/${item._id}`);
  };

  const handleEdit = (item, type) => {
    navigate(`/post?edit=${type}&id=${item._id}`);
  };

  const handleDeleteClick = (item, type) => {
    setDeleteTarget({ item, type });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/listings/${deleteTarget.type}/${deleteTarget.item._id}`);
      toast.success('Listing deleted');
      setDeleteTarget(null);
      fetchListings();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const currentList = data[tab] || [];
  const totalCount = data.rooms.length + data.pgs.length + data.requirements.length;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-dark">My Listings</h1>
            <p className="text-sm text-muted mt-0.5">{totalCount} listing{totalCount !== 1 ? 's' : ''} posted</p>
          </div>
          <Button size="sm" onClick={() => navigate('/post')} className="rounded-xl gap-1.5">
            <Plus size={14} /> New Listing
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'}`}
            >
              <t.icon size={16} /> {t.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${tab === t.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                {(data[t.id] || []).length}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-muted/20 mb-4" />
            <h3 className="font-bold text-dark mb-1">No {tab} listed yet</h3>
            <p className="text-sm text-muted mb-4">Start by posting your first listing</p>
            <Button size="sm" onClick={() => navigate('/post')} className="rounded-xl gap-1.5">
              <Plus size={14} /> Post Listing
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((item) => (
              <ListingCard
                key={item._id}
                item={item}
                type={tab.replace(/s$/, '')}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.item?.title || ''}
      />
    </MainLayout>
  );
}
