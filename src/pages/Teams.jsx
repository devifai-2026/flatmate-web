import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, MapPin, X, Copy, LogOut, Crown, ChevronRight, Key, Check, Heart, Trash2, Share2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { getAvatar, getRoomImage } from '../utils/constants';
import api from '../services/api';

function MemberChip({ member, isCreator }) {
  return (
    <div className="flex items-center gap-2 bg-surface rounded-lg px-2.5 py-1.5">
      <div className="relative">
        <img src={getAvatar(member._id, member.profileImage)} alt="" className="w-7 h-7 rounded-full object-cover" />
        {isCreator && <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center"><Crown size={7} className="text-white" /></div>}
      </div>
      <span className="text-xs font-medium text-dark">{member.name || member.phone}</span>
    </div>
  );
}

function TeamDetail({ team, onClose, onLeave, onRefresh }) {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [wlLoading, setWlLoading] = useState(true);
  const isCreator = team.createdBy?._id === user?._id;

  const getItemPath = (itemType, itemId) => {
    switch (itemType) {
      case 'room': return `/rooms/${itemId}`;
      case 'pg': return `/pgs/${itemId}`;
      case 'requirement': return `/roommates/${itemId}`;
      default: return '#';
    }
  };

  const fetchWl = async () => {
    setWlLoading(true);
    try { const r = await api.get(`/teams/${team._id}/wishlist`); console.log('Team wishlist:', r.data); setWishlist(r.data.data || []); }
    catch (err) { console.error('Team wishlist error:', err.response?.data || err.message); setWishlist([]); }
    setWlLoading(false);
  };
  useEffect(() => { fetchWl(); }, [team._id]);

  const removeWl = async (itemType, itemId) => {
    try { await api.delete(`/teams/${team._id}/wishlist`, { data: { itemType, itemId } }); toast.success('Removed'); fetchWl(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const copyPasskey = () => { navigator.clipboard.writeText(team.passkey); toast.success('Passkey copied!'); };

  const shareTeam = async () => {
    const text = `Join my team "${team.name}" on FlatMate!\n\nPasskey: ${team.passkey}\n\nOpen FlatMate → My Teams → Join → Enter passkey\n${window.location.origin}/teams`;
    if (navigator.share) {
      try { await navigator.share({ title: `Join ${team.name} on FlatMate`, text }); return; } catch {}
    }
    navigator.clipboard.writeText(text);
    toast.success('Invite copied! Share it with friends');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-dark">{team.name}</h2>
          <p className="text-xs text-muted flex items-center gap-1"><MapPin size={11} /> {team.location}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-dark/5 rounded-lg cursor-pointer"><X size={18} /></button>
      </div>

      {team.description && <p className="text-sm text-muted">{team.description}</p>}

      {/* Passkey */}
      <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between border border-primary/10">
        <div>
          <p className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1">Team Passkey</p>
          <p className="text-xl font-mono font-extrabold text-primary tracking-widest">{team.passkey}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyPasskey} className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-dark/5" title="Copy passkey">
            <Copy size={16} className="text-primary" />
          </button>
          <button onClick={shareTeam} className="px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-primary-dark transition-all cursor-pointer flex items-center gap-1.5">
            <Share2 size={14} /> Invite
          </button>
        </div>
      </div>
      <p className="text-[10px] text-muted -mt-3">Share this passkey with friends to invite them</p>

      {/* Members */}
      <div>
        <p className="text-xs font-semibold text-dark mb-2">Members ({team.members.length}/{team.maxMembers})</p>
        <div className="flex flex-wrap gap-2">
          {team.members.map((m) => (
            <MemberChip key={m._id} member={m} isCreator={m._id === team.createdBy?._id} />
          ))}
          {team.members.length < team.maxMembers && (
            <div className="flex items-center gap-1 bg-dark/3 rounded-lg px-2.5 py-1.5 text-xs text-muted">
              <Plus size={12} /> {team.maxMembers - team.members.length} spot{team.maxMembers - team.members.length !== 1 ? 's' : ''} open
            </div>
          )}
        </div>
        <div className="h-1.5 bg-dark/5 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(team.members.length / team.maxMembers) * 100}%` }} />
        </div>
      </div>

      {/* Budget */}
      {team.budget?.max > 0 && (
        <div className="text-sm text-dark">
          Budget: <span className="font-bold text-primary">₹{team.budget.min?.toLocaleString('en-IN')} – ₹{team.budget.max?.toLocaleString('en-IN')}</span>/mo
        </div>
      )}

      {/* Shared Wishlist */}
      <div>
        <p className="text-xs font-semibold text-dark mb-2 flex items-center gap-1"><Heart size={12} className="text-primary" /> Shared Wishlist</p>
        {wlLoading ? (
          <div className="space-y-2">{[0,1].map(i => <div key={i} className="h-16 bg-surface rounded-xl animate-pulse" />)}</div>
        ) : wishlist.length === 0 ? (
          <div className="bg-surface rounded-xl p-4 text-center text-xs text-muted">
            No items saved yet. Browse listings and add to team wishlist.
          </div>
        ) : (
          <div className="space-y-2">
            {wishlist.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface rounded-xl p-2.5 hover:bg-dark/5 transition-colors cursor-pointer"
                onClick={() => navigate(getItemPath(item.itemType, item.itemId))}>
                <img src={getRoomImage(item.itemId, item.data?.images)} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-dark line-clamp-1">{item.data?.title || 'Listing'}</p>
                  <p className="text-[10px] text-muted">{item.itemType} • added by {item.addedBy?.name || 'member'}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeWl(item.itemType, item.itemId); }} className="p-1.5 hover:bg-white rounded-lg cursor-pointer">
                  <Trash2 size={12} className="text-muted" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2">
        {team.conversation && (
          <Button size="sm" className="rounded-xl flex-1" onClick={() => navigate(`/chat?conv=${team.conversation}`)}>
            <MessageCircle size={14} /> Group Chat
          </Button>
        )}
        {!isCreator && (
          <Button variant="ghost" size="sm" className="rounded-xl flex-1" onClick={() => onLeave(team._id)}>
            <LogOut size={14} /> Leave Team
          </Button>
        )}
        {isCreator && (
          <Button variant="ghost" size="sm" className="rounded-xl flex-1 !text-primary" onClick={async () => {
            try { await api.delete(`/teams/${team._id}`); toast.success('Team deleted'); onClose(); onRefresh(); }
            catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
          }}>
            <Trash2 size={14} /> Delete Team
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Teams() {
  const { user } = useSelector((s) => s.auth);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create' | 'join' | null
  const [activeTeam, setActiveTeam] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [form, setForm] = useState({ name: '', description: '', location: '', budgetMin: '', budgetMax: '', maxMembers: 5 });

  const fetchTeams = async () => {
    setLoading(true);
    try { const r = await api.get('/teams'); setTeams(r.data.data || []); }
    catch { setTeams([]); }
    setLoading(false);
  };
  useEffect(() => { fetchTeams(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.location) return toast.error('Name and location required');
    try {
      const body = { name: form.name, description: form.description, location: form.location, maxMembers: Number(form.maxMembers) };
      if (form.budgetMin || form.budgetMax) body.budget = { min: Number(form.budgetMin) || 0, max: Number(form.budgetMax) || 0 };
      const r = await api.post('/teams', body);
      toast.success(`Team created! Passkey: ${r.data.data.passkey}`);
      setModal(null);
      setForm({ name: '', description: '', location: '', budgetMin: '', budgetMax: '', maxMembers: 5 });
      fetchTeams();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!passkey.trim()) return toast.error('Enter a passkey');
    try {
      await api.post('/teams/join', { passkey: passkey.trim() });
      toast.success('Joined team!');
      setModal(null);
      setPasskey('');
      fetchTeams();
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid passkey'); }
  };

  const handleLeave = async (id) => {
    try { await api.post(`/teams/${id}/leave`); toast.success('Left team'); setActiveTeam(null); fetchTeams(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-dark">My Teams</h1>
              <p className="text-xs text-muted">Create or join private teams to search together</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setModal('join')}>
              <Key size={14} /> Join
            </Button>
            <Button size="sm" className="rounded-xl" onClick={() => setModal('create')}>
              <Plus size={14} /> Create
            </Button>
          </div>
        </div>

        {/* Active team detail view */}
        {activeTeam ? (
          <div className="bg-white rounded-2xl border border-dark/6 shadow-sm p-5">
            <TeamDetail team={activeTeam} onClose={() => setActiveTeam(null)} onLeave={handleLeave} onRefresh={fetchTeams} />
          </div>
        ) : (
          <>
            {/* Team list */}
            {loading ? (
              <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}</div>
            ) : teams.length === 0 ? (
              <EmptyState icon={Users} title="No teams yet" description="Create a team and share the passkey with friends, or join one with a passkey." />
            ) : (
              <div className="space-y-3">
                {teams.map((team) => (
                  <motion.button key={team._id} whileHover={{ y: -2 }}
                    onClick={async () => {
                      try { const r = await api.get(`/teams/${team._id}`); setActiveTeam(r.data.data); }
                      catch (err) { toast.error(err.response?.data?.message || 'Failed to load'); }
                    }}
                    className="w-full bg-white rounded-2xl border border-dark/6 shadow-sm hover:shadow-md transition-all p-4 text-left cursor-pointer flex items-center gap-4">
                    {/* Avatar stack */}
                    <div className="flex -space-x-2 flex-shrink-0">
                      {team.members.slice(0, 4).map((m) => (
                        <img key={m._id} src={getAvatar(m._id, m.profileImage)} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-dark">{team.name}</h3>
                        <span className="text-[9px] font-mono text-muted bg-dark/5 px-1.5 py-0.5 rounded">{team.passkey}</span>
                      </div>
                      <p className="text-xs text-muted flex items-center gap-1"><MapPin size={10} /> {team.location} • {team.members.length}/{team.maxMembers} members</p>
                    </div>
                    <ChevronRight size={16} className="text-muted flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create / Join Modal */}
        <AnimatePresence>
          {modal && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/30 z-50" onClick={() => setModal(null)} />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm bg-white rounded-2xl shadow-2xl z-50 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-extrabold text-dark">{modal === 'create' ? 'Create Team' : 'Join Team'}</h2>
                  <button onClick={() => setModal(null)} className="p-1 hover:bg-dark/5 rounded-lg cursor-pointer"><X size={18} /></button>
                </div>

                {modal === 'join' ? (
                  <form onSubmit={handleJoin} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5 block">Enter Passkey</label>
                      <input value={passkey} onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                        placeholder="FM-A7X2K9"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-dark/8 text-dark text-center text-lg font-mono font-bold tracking-[0.3em] outline-none focus:border-primary/40 uppercase" />
                    </div>
                    <Button type="submit" size="lg" className="w-full rounded-xl">
                      <Key size={16} /> Join Team
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleCreate} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Team Name*</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Bangalore 3BHK Squad"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-dark/8 text-sm outline-none focus:border-primary/40" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">City*</label>
                      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-dark/8 text-sm outline-none focus:border-primary/40" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Description</label>
                      <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="What are you looking for?"
                        className="w-full px-3 py-2.5 rounded-xl bg-surface border border-dark/8 text-sm outline-none focus:border-primary/40" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Min Budget</label>
                        <input type="number" value={form.budgetMin} onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                          placeholder="₹5,000"
                          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-dark/8 text-sm outline-none focus:border-primary/40" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Max Budget</label>
                        <input type="number" value={form.budgetMax} onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                          placeholder="₹15,000"
                          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-dark/8 text-sm outline-none focus:border-primary/40" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-1 block">Max Members</label>
                      <div className="flex gap-1.5">
                        {[2,3,4,5,6].map(n => (
                          <button key={n} type="button" onClick={() => setForm({ ...form, maxMembers: n })}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all ${
                              form.maxMembers === n ? 'bg-primary text-white' : 'bg-surface text-muted border border-dark/8'}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="w-full rounded-xl">
                      Create Team <ChevronRight size={16} />
                    </Button>
                  </form>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
