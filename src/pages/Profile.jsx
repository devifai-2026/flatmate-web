import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { fetchProfile, updatePreferences } from '../redux/slices/userSlice';
import api from '../services/api';

export default function Profile() {
  const { id } = useParams(); // if viewing another user's profile
  const dispatch = useDispatch();
  const { profile: myProfile, loading: myLoading } = useSelector((s) => s.user);
  const { user: authUser } = useSelector((s) => s.auth);
  const [otherProfile, setOtherProfile] = useState(null);
  const [otherLoading, setOtherLoading] = useState(false);
  const [prefs, setPrefs] = useState(null);

  const isOwnProfile = !id || id === authUser?._id;
  const profile = isOwnProfile ? myProfile : otherProfile;
  const loading = isOwnProfile ? myLoading : otherLoading;

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchProfile());
    } else {
      setOtherLoading(true);
      api.get(`/users/${id}`).then((r) => setOtherProfile(r.data.data)).catch(() => toast.error('User not found')).finally(() => setOtherLoading(false));
    }
  }, [id, isOwnProfile, dispatch]);
  useEffect(() => {
    if (profile?.preferences) {
      setPrefs({
        budgetMin: profile.preferences.budgetMin || '',
        budgetMax: profile.preferences.budgetMax || '',
        preferredLocation: profile.preferences.preferredLocation || '',
        smoking: profile.preferences.lifestyle?.smoking || false,
        drinking: profile.preferences.lifestyle?.drinking || false,
        pets: profile.preferences.lifestyle?.pets || false,
        sleepSchedule: profile.preferences.lifestyle?.sleepSchedule || 'flexible',
        interests: (profile.preferences.interests || []).join(', '),
        ageMin: profile.preferences.roommatePreferences?.ageMin || '',
        ageMax: profile.preferences.roommatePreferences?.ageMax || '',
        gender: profile.preferences.roommatePreferences?.gender || 'any',
      });
    } else {
      setPrefs({ budgetMin: '', budgetMax: '', preferredLocation: '', smoking: false, drinking: false, pets: false, sleepSchedule: 'flexible', interests: '', ageMin: '', ageMax: '', gender: 'any' });
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      budgetMin: Number(prefs.budgetMin) || undefined,
      budgetMax: Number(prefs.budgetMax) || undefined,
      preferredLocation: prefs.preferredLocation || undefined,
      lifestyle: { smoking: prefs.smoking, drinking: prefs.drinking, pets: prefs.pets, sleepSchedule: prefs.sleepSchedule },
      interests: prefs.interests ? prefs.interests.split(',').map((i) => i.trim()).filter(Boolean) : [],
      roommatePreferences: {
        ageMin: Number(prefs.ageMin) || undefined,
        ageMax: Number(prefs.ageMax) || undefined,
        gender: prefs.gender,
      },
    };
    try {
      await dispatch(updatePreferences(data)).unwrap();
      toast.success('Preferences updated!');
    } catch (err) { toast.error(err); }
  };

  if (loading || !prefs) {
    return <MainLayout><div className="max-w-3xl mx-auto px-4 py-8 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark flex items-center gap-2">
                  {profile?.name}
                  {profile?.verified && <Shield size={16} className="text-primary" />}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted mt-1">
                  <span className="flex items-center gap-1"><Mail size={14} /> {profile?.email}</span>
                  {profile?.phone && <span className="flex items-center gap-1"><Phone size={14} /> {profile?.phone}</span>}
                </div>
                <div className="flex gap-2 mt-2">
                  {profile?.gender && <Badge>{profile.gender}</Badge>}
                  {profile?.age && <Badge color="gray">{profile.age} yrs</Badge>}
                  {profile?.occupation && <Badge color="primary">{profile.occupation}</Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-dark mb-5">Preferences & Lifestyle</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Budget Min (₹)" type="number" value={prefs.budgetMin} onChange={(e) => setPrefs({ ...prefs, budgetMin: e.target.value })} />
                <Input label="Budget Max (₹)" type="number" value={prefs.budgetMax} onChange={(e) => setPrefs({ ...prefs, budgetMax: e.target.value })} />
              </div>

              <Input label="Preferred Location" placeholder="Mumbai, Bangalore..." value={prefs.preferredLocation} onChange={(e) => setPrefs({ ...prefs, preferredLocation: e.target.value })} />

              <div>
                <label className="text-sm font-medium text-dark mb-2 block">Lifestyle</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'smoking', label: 'Smoking' },
                    { key: 'drinking', label: 'Drinking' },
                    { key: 'pets', label: 'Pets' },
                  ].map(({ key, label }) => (
                    <label key={key} className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${prefs[key] ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-muted hover:border-gray-300'}`}>
                      <input type="checkbox" checked={prefs[key]} onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })} className="sr-only" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-dark mb-1.5 block">Sleep Schedule</label>
                <select value={prefs.sleepSchedule} onChange={(e) => setPrefs({ ...prefs, sleepSchedule: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="early-bird">Early Bird</option>
                  <option value="night-owl">Night Owl</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <Input label="Interests" placeholder="gaming, cooking, reading (comma separated)" value={prefs.interests} onChange={(e) => setPrefs({ ...prefs, interests: e.target.value })} />

              <div>
                <label className="text-sm font-medium text-dark mb-2 block">Roommate Preferences</label>
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Age Min" type="number" value={prefs.ageMin} onChange={(e) => setPrefs({ ...prefs, ageMin: e.target.value })} />
                  <Input label="Age Max" type="number" value={prefs.ageMax} onChange={(e) => setPrefs({ ...prefs, ageMax: e.target.value })} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-dark">Gender</label>
                    <select value={prefs.gender} onChange={(e) => setPrefs({ ...prefs, gender: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">Save Preferences</Button>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
