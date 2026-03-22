import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Home, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { createRoom } from '../redux/slices/roomSlice';
import { createRequirement } from '../redux/slices/requirementSlice';

export default function PostListing() {
  const [tab, setTab] = useState('room');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Room form
  const [room, setRoom] = useState({ title: '', description: '', location: '', rent: '', deposit: '', amenities: '', availableFrom: '', preferredTenant: 'any', phoneVisibility: 'masked' });
  // Requirement form
  const [req, setReq] = useState({ type: 'room', title: '', description: '', budgetMin: '', budgetMax: '', location: '', moveInDate: '', notes: '', gender: 'any', smoking: false, drinking: false, pets: false, sleepSchedule: 'flexible' });

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...room,
      rent: Number(room.rent),
      deposit: Number(room.deposit) || 0,
      amenities: room.amenities ? room.amenities.split(',').map((a) => a.trim()).filter(Boolean) : [],
    };
    try {
      await dispatch(createRoom(data)).unwrap();
      toast.success('Room posted successfully!');
      navigate('/search');
    } catch (err) { toast.error(err); }
  };

  const handleReqSubmit = async (e) => {
    e.preventDefault();
    const data = {
      type: req.type,
      title: req.title,
      description: req.description,
      budget: { min: Number(req.budgetMin), max: Number(req.budgetMax) },
      location: req.location,
      moveInDate: req.moveInDate || undefined,
      notes: req.notes,
      preferredRoommate: { gender: req.gender },
      lifestyle: { smoking: req.smoking, drinking: req.drinking, pets: req.pets, sleepSchedule: req.sleepSchedule },
    };
    try {
      await dispatch(createRequirement(data)).unwrap();
      toast.success('Requirement posted successfully!');
      navigate('/search?tab=requirements');
    } catch (err) { toast.error(err); }
  };

  const tabs = [
    { id: 'room', label: 'Post Room', icon: Home },
    { id: 'requirement', label: 'Post Requirement', icon: FileText },
  ];

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-dark mb-6">Create a Listing</h1>

        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {tab === 'room' ? (
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <Input label="Title" placeholder="Spacious 2BHK in Andheri" value={room.title} onChange={(e) => setRoom({ ...room, title: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Description</label>
                <textarea rows={3} value={room.description} onChange={(e) => setRoom({ ...room, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark placeholder-muted/60 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Describe the room..." required />
              </div>
              <Input label="Location" placeholder="Andheri West, Mumbai" value={room.location} onChange={(e) => setRoom({ ...room, location: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Rent (₹)" type="number" placeholder="12000" value={room.rent} onChange={(e) => setRoom({ ...room, rent: e.target.value })} required />
                <Input label="Deposit (₹)" type="number" placeholder="24000" value={room.deposit} onChange={(e) => setRoom({ ...room, deposit: e.target.value })} />
              </div>
              <Input label="Amenities" placeholder="wifi, ac, parking (comma separated)" value={room.amenities} onChange={(e) => setRoom({ ...room, amenities: e.target.value })} />
              <Input label="Available From" type="date" value={room.availableFrom} onChange={(e) => setRoom({ ...room, availableFrom: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Preferred Tenant</label>
                <select value={room.preferredTenant} onChange={(e) => setRoom({ ...room, preferredTenant: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="family">Family</option>
                  <option value="students">Students</option>
                  <option value="working-professionals">Working Professionals</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="w-full">Post Room</Button>
            </form>
          ) : (
            <form onSubmit={handleReqSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">I'm looking for</label>
                <select value={req.type} onChange={(e) => setReq({ ...req, type: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="room">A Room</option>
                  <option value="flatmate">A Flatmate</option>
                </select>
              </div>
              <Input label="Title" placeholder="Looking for 1BHK near..." value={req.title} onChange={(e) => setReq({ ...req, title: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Description</label>
                <textarea rows={3} value={req.description} onChange={(e) => setReq({ ...req, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Describe what you need..." />
              </div>
              <Input label="Location" placeholder="Koramangala, Bangalore" value={req.location} onChange={(e) => setReq({ ...req, location: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Budget Min (₹)" type="number" placeholder="5000" value={req.budgetMin} onChange={(e) => setReq({ ...req, budgetMin: e.target.value })} required />
                <Input label="Budget Max (₹)" type="number" placeholder="15000" value={req.budgetMax} onChange={(e) => setReq({ ...req, budgetMax: e.target.value })} required />
              </div>
              <Input label="Move-in Date" type="date" value={req.moveInDate} onChange={(e) => setReq({ ...req, moveInDate: e.target.value })} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Additional Notes</label>
                <textarea rows={2} value={req.notes} onChange={(e) => setReq({ ...req, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="WFH, need good wifi..." />
              </div>
              <Button type="submit" size="lg" className="w-full">Post Requirement</Button>
            </form>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
