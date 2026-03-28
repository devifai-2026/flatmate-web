import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Phone, Lock, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CityAutocomplete from '../components/ui/CityAutocomplete';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import ImageUpload from '../components/ui/ImageUpload';
import { fetchProfile, updatePreferences } from '../redux/slices/userSlice';
import api from '../services/api';

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile: myProfile, loading: myLoading } = useSelector((s) => s.user);
  const { user: authUser } = useSelector((s) => s.auth);
  const [otherProfile, setOtherProfile] = useState(null);
  const [otherLoading, setOtherLoading] = useState(false);
  const [prefs, setPrefs] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [profileForm, setProfileForm] = useState({ firstName: '', surname: '', age: '', gender: '', occupation: '', city: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const isOwnProfile = !id || id === authUser?._id;
  const profile = isOwnProfile ? myProfile : otherProfile;
  const loading = isOwnProfile ? myLoading : otherLoading;
  const nameEdited = profile?.nameEdited;

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(fetchProfile());
    } else {
      setOtherLoading(true);
      api.get(`/users/${id}`).then((r) => setOtherProfile(r.data.data)).catch(() => toast.error('User not found')).finally(() => setOtherLoading(false));
    }
  }, [id, isOwnProfile, dispatch]);

  useEffect(() => {
    if (!profile) return;
    setProfileForm({
      firstName: profile.firstName || '',
      surname: profile.surname || '',
      age: profile.age || '',
      gender: profile.gender || '',
      occupation: profile.occupation || '',
      city: profile.city || '',
    });
    if (profile.profileImage) setProfileImage(profile.profileImage);
    if (profile.preferences) {
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

  const handleImageChange = async (url) => {
    setProfileImage(url);
    if (url) {
      try {
        await api.put('/users/me', { profileImage: url });
        dispatch(fetchProfile());
        toast.success('Profile photo updated!');
      } catch { toast.error('Failed to update photo'); }
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.firstName.trim()) return toast.error('First name is required');
    if (!profileForm.age || profileForm.age < 18) return toast.error('Age must be 18+');
    setSavingProfile(true);
    try {
      await api.put('/users/me', {
        firstName: profileForm.firstName.trim(),
        surname: profileForm.surname.trim(),
        age: Number(profileForm.age),
        gender: profileForm.gender || undefined,
        occupation: profileForm.occupation || undefined,
        city: profileForm.city || undefined,
      });
      dispatch(fetchProfile());
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePrefsSave = async (e) => {
    e.preventDefault();
    if (prefs.budgetMin && prefs.budgetMax && Number(prefs.budgetMin) > Number(prefs.budgetMax)) return toast.error('Budget min cannot be greater than max');
    if (prefs.ageMin && prefs.ageMax && Number(prefs.ageMin) > Number(prefs.ageMax)) return toast.error('Age min cannot be greater than max');
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
          {/* Profile header card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              {isOwnProfile ? (
                <div className="relative group">
                  {profileImage ? (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                      <img src={profileImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={32} className="text-primary" />
                    </div>
                  )}
                  <ImageUpload
                    value=""
                    onChange={handleImageChange}
                    className="absolute inset-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 rounded-full cursor-pointer [&_button]:w-20 [&_button]:h-20 [&_button]:rounded-full [&_button]:border-0"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <User size={32} className="text-primary" />
                    </div>
                  )}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-dark flex items-center gap-2">
                  {profile?.name || 'Set up your name'}
                  {profile?.verified && <Shield size={16} className="text-primary" />}
                </h1>
                <p className="text-sm text-muted flex items-center gap-1 mt-0.5">
                  <Phone size={13} /> {profile?.phone}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.gender && <Badge>{profile.gender}</Badge>}
                  {profile?.age && <Badge color="gray">{profile.age} yrs</Badge>}
                  {profile?.city && <Badge color="primary">{profile.city}</Badge>}
                  {profile?.occupation && <Badge color="secondary">{profile.occupation}</Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Profile details form (own profile only) */}
          {isOwnProfile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-dark flex items-center gap-2">
                  <Edit3 size={18} className="text-primary" /> Edit Profile
                </h2>
                {nameEdited && (
                  <span className="flex items-center gap-1 text-[10px] text-muted bg-surface px-2 py-1 rounded-lg">
                    <Lock size={10} /> Name locked
                  </span>
                )}
              </div>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-dark">First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      disabled={nameEdited}
                      placeholder="Enter first name"
                      className={`px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${nameEdited ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-dark">Surname</label>
                    <input
                      type="text"
                      value={profileForm.surname}
                      onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })}
                      disabled={nameEdited}
                      placeholder="Enter surname"
                      className={`px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${nameEdited ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
                {!nameEdited && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">Name can only be set once and cannot be changed later</p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Age" type="number" min={18} max={120} placeholder="25" value={profileForm.age} onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })} required />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-dark">Gender</label>
                    <select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <Input label="Occupation" placeholder="Software Engineer, Student..." value={profileForm.occupation} onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })} />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">City</label>
                  <CityAutocomplete
                    value={profileForm.city}
                    onChange={(city) => setProfileForm({ ...profileForm, city })}
                    placeholder="Search your city"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark placeholder-muted/60 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </div>
          )}

          {/* Preferences */}
          {isOwnProfile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-dark mb-5">Preferences & Lifestyle</h2>
              <form onSubmit={handlePrefsSave} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Budget Min (₹)" type="number" value={prefs.budgetMin} onChange={(e) => setPrefs({ ...prefs, budgetMin: e.target.value })} />
                  <Input label="Budget Max (₹)" type="number" value={prefs.budgetMax} onChange={(e) => setPrefs({ ...prefs, budgetMax: e.target.value })} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark">Preferred Location</label>
                  <CityAutocomplete
                    value={prefs.preferredLocation}
                    onChange={(loc) => setPrefs({ ...prefs, preferredLocation: loc })}
                    types="address,poi,neighborhood,locality,place"
                    placeholder="Search area, neighborhood or city"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-dark placeholder-muted/60 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

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
                    <Input label="Age Min" type="number" min={18} value={prefs.ageMin} onChange={(e) => setPrefs({ ...prefs, ageMin: e.target.value })} />
                    <Input label="Age Max" type="number" min={prefs.ageMin || 18} value={prefs.ageMax} onChange={(e) => setPrefs({ ...prefs, ageMax: e.target.value })} />
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
          )}

          {/* Other user profile — just show info */}
          {!isOwnProfile && profile && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-dark mb-4">About</h2>
              {profile.bio && <p className="text-sm text-muted mb-4">{profile.bio}</p>}
              <div className="flex flex-wrap gap-2">
                {profile.lifestyleTags?.map((tag) => (
                  <Badge key={tag} color="primary">{tag.replace(/-/g, ' ')}</Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
