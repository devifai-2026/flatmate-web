import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Home, FileText, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CityAutocomplete from '../components/ui/CityAutocomplete';
import ImageUpload from '../components/ui/ImageUpload';
import { createRoom } from '../redux/slices/roomSlice';
import { createRequirement } from '../redux/slices/requirementSlice';
import api from '../services/api';
import { LIFESTYLE_TAGS } from '../utils/constants';

const AMENITIES = ['wifi', 'ac', 'parking', 'laundry', 'kitchen', 'gym', 'power-backup', 'water-supply', 'security', 'cctv', 'lift', 'fridge', 'geyser', 'tv', 'wardrobe', 'attached-bathroom'];

export default function PostListing() {
  const [searchParams] = useSearchParams();
  const editType = searchParams.get('edit'); // 'room' | 'pg' | 'requirement'
  const editId = searchParams.get('id');
  const isEditing = !!(editType && editId);

  const [tab, setTab] = useState(editType || 'room');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editLoading, setEditLoading] = useState(false);

  // Room form
  const [room, setRoom] = useState({ title: '', description: '', location: '', rent: '', deposit: '', availableFrom: '', preferredTenant: 'any', roomType: '', furnishing: '', bathrooms: '', floor: '', totalArea: '', parking: 'none' });
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [roomImages, setRoomImages] = useState([]);

  // PG form
  const [pg, setPg] = useState({ title: '', description: '', location: '', city: '', rent: '', deposit: '', sharing: 'any', gender: 'unisex', meals: false, mealType: '' });
  const [pgAmenities, setPgAmenities] = useState([]);
  const [pgImages, setPgImages] = useState([]);
  const [pgSubmitting, setPgSubmitting] = useState(false);

  // Flatmate requirement form
  const [req, setReq] = useState({
    title: '', description: '', budgetMin: '', budgetMax: '', location: '', moveInDate: '', notes: '',
    gender: '', age: '', occupation: '', religion: 'no-preference', foodPreference: 'no-preference',
    languages: '', roomType: 'any',
    prefGender: 'any', prefAgeMin: '', prefAgeMax: '', prefReligion: '', prefFood: '',
    smoking: false, drinking: false, pets: false, sleepSchedule: 'flexible', cleanliness: 'moderate', guests: 'sometimes',
  });
  const [reqImages, setReqImages] = useState([]);
  const [reqTags, setReqTags] = useState([]);

  // Fetch existing data when editing
  useEffect(() => {
    if (!isEditing) return;
    setEditLoading(true);
    const endpoint = editType === 'room' ? `/rooms/${editId}` : editType === 'pg' ? `/pgs/${editId}` : `/requirements/${editId}`;
    api.get(endpoint)
      .then(({ data: res }) => {
        const d = res.data;
        if (editType === 'room') {
          setRoom({
            title: d.title || '', description: d.description || '', location: d.location || '',
            rent: d.rent || '', deposit: d.deposit || '', availableFrom: d.availableFrom ? d.availableFrom.slice(0, 10) : '',
            preferredTenant: d.preferredTenant || 'any', roomType: d.roomType || '', furnishing: d.furnishing || '',
            bathrooms: d.bathrooms || '', floor: d.floor || '', totalArea: d.totalArea || '', parking: d.parking || 'none',
          });
          setRoomAmenities(d.amenities || []);
          setRoomImages(d.images || []);
        } else if (editType === 'pg') {
          setPg({
            title: d.title || '', description: d.description || '', location: d.location || '', city: d.city || '',
            rent: d.rent || '', deposit: d.deposit || '', sharing: d.sharing || 'any', gender: d.gender || 'unisex',
            meals: d.meals || false, mealType: d.mealType || '',
          });
          setPgAmenities(d.amenities || []);
          setPgImages(d.images || []);
        } else if (editType === 'requirement') {
          setReq({
            title: d.title || '', description: d.description || '',
            budgetMin: d.budget?.min || '', budgetMax: d.budget?.max || '',
            location: d.location || '', moveInDate: d.moveInDate ? d.moveInDate.slice(0, 10) : '', notes: d.notes || '',
            gender: d.gender || '', age: d.age || '', occupation: d.occupation || '',
            religion: d.religion || 'no-preference', foodPreference: d.foodPreference || 'no-preference',
            languages: (d.languages || []).join(', '), roomType: d.roomType || 'any',
            prefGender: d.preferredRoommate?.gender || 'any',
            prefAgeMin: d.preferredRoommate?.ageMin || '', prefAgeMax: d.preferredRoommate?.ageMax || '',
            prefReligion: d.preferredRoommate?.religion || '', prefFood: d.preferredRoommate?.foodPreference || '',
            smoking: d.lifestyle?.smoking || false, drinking: d.lifestyle?.drinking || false, pets: d.lifestyle?.pets || false,
            sleepSchedule: d.lifestyle?.sleepSchedule || 'flexible', cleanliness: d.lifestyle?.cleanliness || 'moderate',
            guests: d.lifestyle?.guests || 'sometimes',
          });
          setReqImages(d.images || []);
          setReqTags(d.lifestyleTags || []);
        }
      })
      .catch(() => toast.error('Failed to load listing data'))
      .finally(() => setEditLoading(false));
  }, [editType, editId, isEditing]);

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...room, rent: Number(room.rent), deposit: Number(room.deposit) || 0,
      bathrooms: room.bathrooms ? Number(room.bathrooms) : undefined,
      amenities: roomAmenities,
      images: roomImages,
    };
    try {
      if (isEditing) {
        await api.put(`/rooms/${editId}`, data);
        toast.success('Room updated!');
        navigate('/my-listings');
      } else {
        await dispatch(createRoom(data)).unwrap();
        toast.success('Room posted successfully!');
        navigate('/search');
      }
    } catch (err) { toast.error(err?.response?.data?.message || err || 'Failed'); }
  };

  const handlePgSubmit = async (e) => {
    e.preventDefault();
    if (!pg.title) return toast.error('Enter PG name');
    if (!pg.rent) return toast.error('Enter rent');
    if (!pg.location) return toast.error('Enter location');
    if (!pg.city) return toast.error('Enter city');
    setPgSubmitting(true);
    try {
      const pgData = {
        title: pg.title, description: pg.description, location: pg.location, city: pg.city,
        rent: Number(pg.rent), deposit: Number(pg.deposit) || 0,
        sharing: pg.sharing, gender: pg.gender,
        meals: pg.meals, mealType: pg.meals ? pg.mealType : undefined,
        amenities: pgAmenities, images: pgImages,
      };
      if (isEditing) {
        await api.put(`/pgs/${editId}`, pgData);
        toast.success('PG updated!');
        navigate('/my-listings');
      } else {
        await api.post('/pgs', pgData);
        toast.success('PG posted successfully!');
        navigate('/search?tab=pgs');
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setPgSubmitting(false);
  };

  const handleReqSubmit = async (e) => {
    e.preventDefault();
    if (!req.title) return toast.error('Enter a title');
    if (!req.location) return toast.error('Enter location');
    if (!req.budgetMin || !req.budgetMax) return toast.error('Enter budget range');
    if (reqTags.length < 5) return toast.error('Select at least 5 lifestyle preferences');
    const data = {
      type: 'flatmate', title: req.title, description: req.description,
      budget: { min: Number(req.budgetMin), max: Number(req.budgetMax) },
      location: req.location, moveInDate: req.moveInDate || undefined, notes: req.notes,
      gender: req.gender || undefined, age: req.age ? Number(req.age) : undefined,
      occupation: req.occupation || undefined,
      religion: req.religion, foodPreference: req.foodPreference,
      languages: req.languages ? req.languages.split(',').map((l) => l.trim()).filter(Boolean) : [],
      roomType: req.roomType,
      preferredRoommate: { gender: req.prefGender, ageMin: req.prefAgeMin ? Number(req.prefAgeMin) : undefined, ageMax: req.prefAgeMax ? Number(req.prefAgeMax) : undefined, religion: req.prefReligion || undefined, foodPreference: req.prefFood || undefined },
      lifestyle: { smoking: req.smoking, drinking: req.drinking, pets: req.pets, sleepSchedule: req.sleepSchedule, cleanliness: req.cleanliness, guests: req.guests },
      lifestyleTags: reqTags,
      images: reqImages,
    };
    try {
      if (isEditing) {
        await api.put(`/requirements/${editId}`, data);
        toast.success('Profile updated!');
        navigate('/my-listings');
      } else {
        await dispatch(createRequirement(data)).unwrap();
        toast.success('Flatmate profile posted!');
        navigate('/search?tab=roommates');
      }
    } catch (err) { toast.error(err?.response?.data?.message || err || 'Failed'); }
  };

  const tabs = [
    { id: 'room', label: 'Post Room', icon: Home },
    { id: 'pg', label: 'Post PG', icon: Building2 },
    { id: 'requirement', label: 'Find Flatmate', icon: FileText },
  ];

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-dark mb-6">{isEditing ? 'Edit Listing' : 'Create a Listing'}</h1>

        {!isEditing && (
          <div className="flex gap-2 mb-6">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'}`}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </div>
        )}

        {editLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : null}

        <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${editLoading ? 'hidden' : ''}`}>

          {/* ═══ ROOM ═══ */}
          {tab === 'room' && (
            <form onSubmit={handleRoomSubmit} className="space-y-4">
              <Input label="Title" placeholder="Spacious 2BHK in Andheri" value={room.title} onChange={(e) => setRoom({ ...room, title: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Description</label>
                <textarea rows={3} value={room.description} onChange={(e) => setRoom({ ...room, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark outline-none focus:ring-2 focus:ring-primary/20" placeholder="Describe the room, neighborhood, nearby facilities..." required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Location</label>
                <CityAutocomplete value={room.location} onChange={(city) => setRoom({ ...room, location: city })} types="address,poi,neighborhood,locality,place" placeholder="Search full address or area" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Rent (₹/month)" type="number" placeholder="12000" value={room.rent} onChange={(e) => setRoom({ ...room, rent: e.target.value })} required />
                <Input label="Deposit (₹)" type="number" placeholder="24000" value={room.deposit} onChange={(e) => setRoom({ ...room, deposit: e.target.value })} />
              </div>

              {/* Room Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Room Type</label>
                <div className="flex flex-wrap gap-2">
                  {['1rk', '1bhk', '2bhk', '3bhk', '4bhk+', 'single-room', 'shared-room'].map((t) => (
                    <button key={t} type="button" onClick={() => setRoom({ ...room, roomType: t })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all uppercase ${room.roomType === t ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200 hover:border-primary/30'}`}>
                      {t.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Furnishing */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Furnishing</label>
                <div className="flex gap-2">
                  {[{ id: 'fully-furnished', label: '🛋️ Fully Furnished' }, { id: 'semi-furnished', label: '🪑 Semi Furnished' }, { id: 'unfurnished', label: '📦 Unfurnished' }].map((f) => (
                    <button key={f.id} type="button" onClick={() => setRoom({ ...room, furnishing: f.id })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${room.furnishing === f.id ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200 hover:border-primary/30'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input label="Bathrooms" type="number" placeholder="2" value={room.bathrooms} onChange={(e) => setRoom({ ...room, bathrooms: e.target.value })} />
                <Input label="Floor" placeholder="3rd" value={room.floor} onChange={(e) => setRoom({ ...room, floor: e.target.value })} />
                <Input label="Area (sq ft)" placeholder="800" value={room.totalArea} onChange={(e) => setRoom({ ...room, totalArea: e.target.value })} />
              </div>

              {/* Parking */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Parking</label>
                <div className="flex gap-2">
                  {[{ id: 'none', label: 'None' }, { id: 'bike', label: '🏍️ Bike' }, { id: 'car', label: '🚗 Car' }, { id: 'both', label: 'Both' }].map((p) => (
                    <button key={p.id} type="button" onClick={() => setRoom({ ...room, parking: p.id })}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${room.parking === p.id ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Available From" type="date" value={room.availableFrom} onChange={(e) => setRoom({ ...room, availableFrom: e.target.value })} required />

              {/* Preferred Tenant */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Preferred Tenant</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: 'any', label: 'Any' }, { id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }, { id: 'family', label: 'Family' }, { id: 'students', label: 'Students' }, { id: 'working-professionals', label: 'Working Professionals' }].map((t) => (
                    <button key={t.id} type="button" onClick={() => setRoom({ ...room, preferredTenant: t.id })}
                      className={`px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${room.preferredTenant === t.id ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button key={a} type="button" onClick={() => setRoomAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all capitalize ${roomAmenities.includes(a) ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                      {a.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Photos</label>
                <ImageUpload value={roomImages} onChange={setRoomImages} multiple />
              </div>
              <Button type="submit" size="lg" className="w-full">{isEditing ? 'Update Room' : 'Post Room'}</Button>
            </form>
          )}

          {/* ═══ PG ═══ */}
          {tab === 'pg' && (
            <form onSubmit={handlePgSubmit} className="space-y-4">
              <Input label="PG Name" placeholder="Sunshine PG for Girls" value={pg.title} onChange={(e) => setPg({ ...pg, title: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Description</label>
                <textarea rows={3} value={pg.description} onChange={(e) => setPg({ ...pg, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark outline-none focus:ring-2 focus:ring-primary/20" placeholder="Describe your PG, rules, facilities..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Full Address</label>
                <CityAutocomplete value={pg.location} onChange={(loc) => setPg({ ...pg, location: loc })} types="address,poi,neighborhood,locality,place" placeholder="No. 123, 5th Cross, Koramangala" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <Input label="City" placeholder="Bangalore" value={pg.city} onChange={(e) => setPg({ ...pg, city: e.target.value })} required />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Rent (₹/month)" type="number" placeholder="8000" value={pg.rent} onChange={(e) => setPg({ ...pg, rent: e.target.value })} required />
                <Input label="Deposit (₹)" type="number" placeholder="16000" value={pg.deposit} onChange={(e) => setPg({ ...pg, deposit: e.target.value })} />
              </div>

              {/* Sharing Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Sharing Type</label>
                <div className="flex gap-2">
                  {['single', 'double', 'triple', 'any'].map((s) => (
                    <button key={s} type="button" onClick={() => setPg({ ...pg, sharing: s })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${pg.sharing === s ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200 hover:border-primary/30'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Gender</label>
                <div className="flex gap-2">
                  {['male', 'female', 'unisex'].map((g) => (
                    <button key={g} type="button" onClick={() => setPg({ ...pg, gender: g })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${pg.gender === g ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200 hover:border-primary/30'}`}>
                      {g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🏠 Unisex'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={pg.meals} onChange={(e) => setPg({ ...pg, meals: e.target.checked })} className="sr-only peer" />
                  <div className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${pg.meals ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🍽️</span>
                      <div>
                        <p className="text-sm font-medium text-dark">Meals Included</p>
                        <p className="text-xs text-muted">Breakfast, lunch, dinner</p>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full transition-colors ${pg.meals ? 'bg-primary' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${pg.meals ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </label>

                {pg.meals && (
                  <div className="flex gap-2 ml-1">
                    {['veg', 'non-veg', 'both'].map((mt) => (
                      <button key={mt} type="button" onClick={() => setPg({ ...pg, mealType: mt })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${pg.mealType === mt ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                        {mt === 'veg' ? '🟢 Veg' : mt === 'non-veg' ? '🔴 Non-Veg' : '🟡 Both'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES.map((a) => (
                    <button key={a} type="button" onClick={() => setPgAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${pgAmenities.includes(a) ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                      {a.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Photos</label>
                <ImageUpload value={pgImages} onChange={setPgImages} multiple />
              </div>

              <Button type="submit" size="lg" className="w-full" loading={pgSubmitting}>{isEditing ? 'Update PG' : 'Post PG'}</Button>
            </form>
          )}

          {/* ═══ FIND FLATMATE ═══ */}
          {tab === 'requirement' && (
            <form onSubmit={handleReqSubmit} className="space-y-5">
              <p className="text-xs text-muted bg-primary/5 rounded-xl p-3 border border-primary/10">This will create your flatmate profile visible in the Roommates search. Fill in details about yourself and what you're looking for.</p>

              {/* About You */}
              <div className="border-b border-gray-100 pb-1 mb-1">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">👤 About You</h3>
              </div>
              <Input label="Headline" placeholder="26M, Software Engineer looking for flatmate in Koramangala" value={req.title} onChange={(e) => setReq({ ...req, title: e.target.value })} required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">About Yourself</label>
                <textarea rows={3} value={req.description} onChange={(e) => setReq({ ...req, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="Tell potential flatmates about yourself, your routine, hobbies..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Gender</label>
                  <select value={req.gender} onChange={(e) => setReq({ ...req, gender: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
                <Input label="Age" type="number" placeholder="25" value={req.age} onChange={(e) => setReq({ ...req, age: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Occupation</label>
                  <select value={req.occupation} onChange={(e) => setReq({ ...req, occupation: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select</option>
                    <option value="student">Student</option>
                    <option value="working-professional">Working Professional</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Religion</label>
                  <select value={req.religion} onChange={(e) => setReq({ ...req, religion: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="no-preference">No Preference</option>
                    <option value="hindu">Hindu</option>
                    <option value="muslim">Muslim</option>
                    <option value="christian">Christian</option>
                    <option value="sikh">Sikh</option>
                    <option value="jain">Jain</option>
                    <option value="buddhist">Buddhist</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Food Preference</label>
                  <div className="flex gap-2">
                    {[{ id: 'veg', label: '🟢 Veg' }, { id: 'non-veg', label: '🔴 Non-Veg' }, { id: 'no-preference', label: 'Any' }].map((f) => (
                      <button key={f.id} type="button" onClick={() => setReq({ ...req, foodPreference: f.id })}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${req.foodPreference === f.id ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="Languages" placeholder="Hindi, English, Tamil" value={req.languages} onChange={(e) => setReq({ ...req, languages: e.target.value })} />
              </div>

              {/* Location & Budget */}
              <div className="border-b border-gray-100 pb-1 mb-1 mt-2">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">📍 Location & Budget</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Preferred Location</label>
                <CityAutocomplete value={req.location} onChange={(city) => setReq({ ...req, location: city })} types="address,poi,neighborhood,locality,place" placeholder="Search area or city" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Budget Min (₹)" type="number" placeholder="5000" value={req.budgetMin} onChange={(e) => setReq({ ...req, budgetMin: e.target.value })} required />
                <Input label="Budget Max (₹)" type="number" placeholder="15000" value={req.budgetMax} onChange={(e) => setReq({ ...req, budgetMax: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Move-in Date" type="date" value={req.moveInDate} onChange={(e) => setReq({ ...req, moveInDate: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Room Type</label>
                  <div className="flex gap-2">
                    {['single', 'shared', 'any'].map((r) => (
                      <button key={r} type="button" onClick={() => setReq({ ...req, roomType: r })}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium cursor-pointer capitalize transition-all ${req.roomType === r ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="border-b border-gray-100 pb-1 mb-1 mt-2">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">🏠 Lifestyle</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'smoking', label: '🚬 Smoking', on: req.smoking },
                  { key: 'drinking', label: '🍷 Drinking', on: req.drinking },
                  { key: 'pets', label: '🐾 Pets', on: req.pets },
                ].map(({ key, label, on }) => (
                  <button key={key} type="button" onClick={() => setReq({ ...req, [key]: !on })}
                    className={`py-3 rounded-xl text-xs font-medium cursor-pointer transition-all ${on ? 'bg-primary text-white' : 'bg-gray-50 text-muted border border-gray-200'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Sleep Schedule</label>
                  <select value={req.sleepSchedule} onChange={(e) => setReq({ ...req, sleepSchedule: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="early-bird">🌅 Early Bird</option>
                    <option value="night-owl">🦉 Night Owl</option>
                    <option value="flexible">🔄 Flexible</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Cleanliness</label>
                  <select value={req.cleanliness} onChange={(e) => setReq({ ...req, cleanliness: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="very-clean">✨ Very Clean</option>
                    <option value="moderate">👍 Moderate</option>
                    <option value="relaxed">😎 Relaxed</option>
                  </select>
                </div>
              </div>

              {/* Preferred Flatmate */}
              <div className="border-b border-gray-100 pb-1 mb-1 mt-2">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">🎯 Preferred Flatmate</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Gender</label>
                  <select value={req.prefGender} onChange={(e) => setReq({ ...req, prefGender: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <Input label="Age Min" type="number" placeholder="20" value={req.prefAgeMin} onChange={(e) => setReq({ ...req, prefAgeMin: e.target.value })} />
                <Input label="Age Max" type="number" placeholder="35" value={req.prefAgeMax} onChange={(e) => setReq({ ...req, prefAgeMax: e.target.value })} />
              </div>

              {/* Lifestyle Preferences — min 5 */}
              <div className="border-b border-gray-100 pb-1 mb-1 mt-2">
                <h3 className="text-sm font-bold text-dark flex items-center gap-2">✨ Lifestyle Preferences <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${reqTags.length >= 5 ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-muted'}`}>{reqTags.length}/5</span></h3>
                <p className="text-xs text-muted mt-1">Select at least 5 that describe you</p>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {LIFESTYLE_TAGS.map((tag) => {
                  const on = reqTags.includes(tag.id);
                  return (
                    <button key={tag.id} type="button" onClick={() => setReqTags((p) => p.includes(tag.id) ? p.filter((t) => t !== tag.id) : [...p, tag.id])}
                      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all cursor-pointer ${on ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <span className="text-lg">{tag.emoji}</span>
                      <span className={`text-[9px] font-semibold leading-tight text-center ${on ? 'text-primary' : 'text-muted'}`}>{tag.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Notes & Photos (max 3) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Additional Notes</label>
                <textarea rows={2} value={req.notes} onChange={(e) => setReq({ ...req, notes: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-primary/20" placeholder="Any other preferences or info..." />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-dark">Photos (max 3)</label>
                <ImageUpload value={reqImages} onChange={setReqImages} multiple max={3} />
              </div>
              <Button type="submit" size="lg" className="w-full">{isEditing ? 'Update Profile' : 'Post Flatmate Profile'}</Button>
            </form>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
