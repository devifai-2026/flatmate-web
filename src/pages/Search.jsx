import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Building2, LayoutGrid, MapPin, Plus, SearchX, Filter, X, Loader2, Sparkles, ArrowUpDown, UserPlus, Search as SearchIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/layout/Sidebar';
import RoomCard from '../components/cards/RoomCard';
import ContactButtons from '../components/ui/ContactButtons';
import SaveButton from '../components/ui/SaveButton';
import ShareButton from '../components/ui/ShareButton';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { fetchRooms, clearRooms } from '../redux/slices/roomSlice';
import { fetchRequirements, clearRequirements } from '../redux/slices/requirementSlice';
import { getAvatar, getRoomImage } from '../utils/constants';
import api from '../services/api';

// ── Match% calculator (works for rooms, roommates, PGs) ──
function calcMatch(item, prefs, userCity, type) {
  if (!prefs) return null;
  let score = 0, factors = 0;

  // Budget match (40 pts)
  const budgetMin = prefs.budgetMin || 0;
  const budgetMax = prefs.budgetMax || Infinity;
  const rent = type === 'roommate' ? (item.budget?.max || 0) : (item.rent || 0);
  if (budgetMin || budgetMax < Infinity) {
    factors += 40;
    if (rent >= budgetMin && rent <= budgetMax) score += 40;
    else {
      const range = budgetMax - budgetMin || 10000;
      const diff = rent < budgetMin ? budgetMin - rent : rent - budgetMax;
      score += Math.max(0, 40 - Math.round((diff / range) * 40));
    }
  }

  // Location match (40 pts)
  const target = (prefs.preferredLocation || userCity || '').toLowerCase();
  const loc = (item.location || item.city || '').toLowerCase();
  if (target) {
    factors += 40;
    if (loc.includes(target) || target.includes(loc)) score += 40;
  }

  // Gender match (20 pts) — for roommates and PGs
  if (type === 'roommate' && prefs.roommatePreferences?.gender) {
    factors += 20;
    const prefG = prefs.roommatePreferences.gender;
    const itemG = item.preferredGender || 'any';
    if (prefG === 'any' || itemG === 'any' || prefG === itemG) score += 20;
  }
  if (type === 'pg' && item.gender) {
    factors += 20;
    if (item.gender === 'unisex') score += 20;
    else {
      const userGender = prefs._userGender;
      if (!userGender || item.gender === userGender) score += 20;
    }
  }

  if (factors === 0) return null;
  const pct = Math.round((score / factors) * 100);
  return pct < 15 ? null : pct;
}

function MatchBadge({ pct }) {
  if (!pct) return null;
  return (
    <div className="bg-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
      <Sparkles size={10} className="text-primary" />
      <span className="text-primary">{pct}%</span>
      <span className="text-muted font-medium">Match</span>
    </div>
  );
}

// ── Roommate card ──
function FlatmateCard({ user: u, match }) {
  const avatar = getAvatar(u._id, u.profileImage);
  return (
    <Link to={`/roommates/${u.reqId || u._id}`}>
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -3 }}
        className="bg-white rounded-2xl overflow-hidden border border-dark/6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img src={avatar} alt={u.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/5" />
          <div className="absolute top-3 right-3">
            <div className="flex gap-1.5">
              <ShareButton url={`${window.location.origin}/roommates/${u.reqId || u._id}`} title={u.name} />
              <SaveButton itemType="requirement" itemId={u.reqId} />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <h3 className="font-bold text-white text-sm drop-shadow-lg">{u.name || 'User'}</h3>
              <p className="text-white/70 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin size={10} /> {u.city || u.preferredLocation || 'India'}
              </p>
            </div>
            <MatchBadge pct={match} />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex gap-4 mb-2">
            {u.budget?.max && (
              <div>
                <p className="text-[9px] text-muted uppercase tracking-wider">Budget</p>
                <p className="text-sm font-bold text-dark">₹{u.budget.max.toLocaleString('en-IN')}</p>
              </div>
            )}
            <div>
              <p className="text-[9px] text-muted uppercase tracking-wider">Looking for</p>
              <p className="text-sm font-bold text-dark capitalize">{u.preferredGender || 'Any'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-dark/5">
            <div className="flex-1 py-2 rounded-lg text-xs font-semibold text-center text-primary bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all">
              View Details
            </div>
            <ContactButtons userId={u.createdById || u._id} phone={u.contactPhone || u.phone} phoneVisibility={u.phoneVisibility} listingType="requirement" listingId={u.reqId} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── PG card ──
function PGCard({ pg, match }) {
  const image = getRoomImage(pg._id, pg.images);
  return (
    <Link to={`/pgs/${pg._id}`}>
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -3 }}
        className="bg-white rounded-2xl overflow-hidden border border-dark/6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={pg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-dark/5" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="bg-white text-dark text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-md">
              ₹{pg.rent?.toLocaleString('en-IN')}<span className="text-xs font-normal text-muted">/mo</span>
            </div>
            <div className="flex gap-1.5">
              <ShareButton url={`${window.location.origin}/pgs/${pg._id}`} title={pg.title} />
              <SaveButton itemType="pg" itemId={pg._id} />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex gap-1">
              <span className="bg-white text-dark text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">PG</span>
              {pg.gender && pg.gender !== 'unisex' && <span className="bg-white text-dark text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm capitalize">{pg.gender}</span>}
              {pg.meals && <span className="bg-white text-dark text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">Meals</span>}
            </div>
            <MatchBadge pct={match} />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-dark text-sm line-clamp-1 group-hover:text-primary transition-colors">{pg.title}</h3>
          <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin size={11} /> {pg.location}</p>
          {pg.sharing && <p className="text-xs text-muted mt-1 capitalize">{pg.sharing} sharing</p>}
          {pg.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {pg.amenities.slice(0, 4).map((a) => (
                <span key={a} className="bg-surface text-muted text-[10px] font-medium px-2 py-0.5 rounded-md capitalize">{a}</span>
              ))}
              {pg.amenities.length > 4 && <span className="bg-primary/5 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-md">+{pg.amenities.length - 4} more</span>}
            </div>
          )}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-dark/5">
            <div className="flex-1 py-2 rounded-lg text-xs font-semibold text-center text-primary bg-primary/5 group-hover:bg-primary group-hover:text-white transition-all">
              View Details
            </div>
            <ContactButtons userId={pg.postedBy?._id || pg.postedBy} phone={pg.contactPhone} phoneVisibility={pg.phoneVisibility} listingType="pg" listingId={pg._id} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Infinite scroll sentinel ──
function ScrollSentinel({ onVisible, loading, hasMore }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !loading && hasMore) onVisible(); },
      { rootMargin: '300px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, loading, hasMore]);

  if (!hasMore) return null;
  return (
    <div ref={ref} className="flex justify-center py-6">
      {loading && <Loader2 size={22} className="text-primary animate-spin" />}
    </div>
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const tab = searchParams.get('tab') || 'all';
  const initialLocation = searchParams.get('location') || '';
  const [filters, setFilters] = useState({ location: initialLocation });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'price-low' | 'price-high'

  const { list: rooms, loading: roomsLoading, pagination: roomPag } = useSelector((s) => s.rooms);
  const { list: requirements, loading: reqLoading, pagination: reqPag } = useSelector((s) => s.requirements);
  const { profile } = useSelector((s) => s.user);
  const prefs = profile?.preferences ? { ...profile.preferences, _userGender: profile?.gender } : null;
  const [pgs, setPgs] = useState([]);
  const [pgsLoading, setPgsLoading] = useState(false);
  const [pgPag, setPgPag] = useState(null);

  const setTab = (t) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', t);
    setSearchParams(params);
  };

  // Build filter params per tab (plain functions, not memoized)
  const getRoomParams = () => ({
    location: filters.location || undefined, minRent: filters.minBudget || undefined, maxRent: filters.maxBudget || undefined,
    preferredTenant: filters.preferredTenant || undefined,
  });

  const getRoommateParams = () => ({
    location: filters.location || undefined, minBudget: filters.minBudget || undefined, maxBudget: filters.maxBudget || undefined,
    gender: filters.gender || undefined, sleepSchedule: filters.sleepSchedule || undefined,
    smoking: filters.smoking ? 'false' : undefined,
    drinking: filters.drinking ? 'false' : undefined,
    pets: filters.pets ? 'true' : undefined,
  });

  const getPgParams = () => ({
    city: filters.location || undefined, location: filters.location || undefined,
    minRent: filters.minBudget || undefined, maxRent: filters.maxBudget || undefined,
    gender: filters.pgGender || undefined, sharing: filters.sharing || undefined,
    meals: filters.meals ? 'true' : undefined,
  });

  // Serialized filter key for effect dependency
  const filterKey = JSON.stringify(filters);

  // Fetch on tab or filter change
  useEffect(() => {
    if (tab === 'rooms' || tab === 'all') { dispatch(clearRooms()); dispatch(fetchRooms({ ...getRoomParams(), page: 1 })); }
    if (tab === 'roommates' || tab === 'all') { dispatch(clearRequirements()); dispatch(fetchRequirements({ ...getRoommateParams(), page: 1 })); }
    if (tab === 'pgs' || tab === 'all') {
      setPgsLoading(true);
      setPgs([]);
      api.get('/pgs', { params: { ...getPgParams(), page: 1 } })
        .then((r) => { setPgs(r.data.pgs || []); setPgPag(r.data.pagination || null); })
        .catch(() => setPgs([]))
        .finally(() => setPgsLoading(false));
    }
  }, [tab, filterKey, dispatch]);

  // ── Infinite scroll load-more callbacks ──
  const loadMoreRooms = useCallback(() => {
    if (!roomPag || roomPag.page >= roomPag.pages || roomsLoading) return;
    dispatch(fetchRooms({ ...getRoomParams(), page: roomPag.page + 1, append: true }));
  }, [roomPag, roomsLoading, filterKey, dispatch]);

  const loadMoreRequirements = useCallback(() => {
    if (!reqPag || reqPag.page >= reqPag.pages || reqLoading) return;
    dispatch(fetchRequirements({ ...getRoommateParams(), page: reqPag.page + 1, append: true }));
  }, [reqPag, reqLoading, filterKey, dispatch]);

  const loadMorePgs = useCallback(() => {
    if (!pgPag || pgPag.page >= pgPag.pages || pgsLoading) return;
    setPgsLoading(true);
    api.get('/pgs', { params: { ...getPgParams(), page: pgPag.page + 1 } })
      .then((r) => {
        const newPgs = r.data.pgs || [];
        setPgs((prev) => {
          const existingIds = new Set(prev.map((p) => p._id));
          return [...prev, ...newPgs.filter((p) => !existingIds.has(p._id))];
        });
        setPgPag(r.data.pagination || null);
      })
      .catch(() => {})
      .finally(() => setPgsLoading(false));
  }, [pgPag, pgsLoading, filterKey]);

  const tabs = [
    { id: 'all', label: 'All Listing', icon: LayoutGrid },
    { id: 'rooms', label: 'Rooms', icon: Home },
    { id: 'roommates', label: 'Roommates', icon: Users },
    { id: 'pgs', label: 'PG', icon: Building2 },
  ];

  // ── Sort helper ──
  const getPrice = (item) => item.rent || item.budget?.max || 0;
  const getMatch = (item, type) => {
    if (type === 'room') return calcMatch(item, prefs, profile?.city, 'room') || 0;
    if (type === 'pg') return calcMatch(item, prefs, profile?.city, 'pg') || 0;
    return calcMatch({ budget: item.budget, location: item.location, preferredGender: item.preferredRoommate?.gender }, prefs, profile?.city, 'roommate') || 0;
  };
  const sortItems = (items, type) => {
    if (sortBy === 'price-low') return [...items].sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === 'price-high') return [...items].sort((a, b) => getPrice(b) - getPrice(a));
    if (sortBy === 'match') return [...items].sort((a, b) => getMatch(b, type) - getMatch(a, type));
    return items;
  };

  const sortedRooms = sortItems(rooms, 'room');
  const sortedReqs = sortItems(requirements, 'requirement');
  const sortedPgs = sortItems(pgs, 'pg');

  const isInitialLoading = (tab === 'rooms' && roomsLoading && rooms.length === 0)
    || (tab === 'roommates' && reqLoading && requirements.length === 0)
    || (tab === 'pgs' && pgsLoading && pgs.length === 0)
    || (tab === 'all' && (roomsLoading || reqLoading || pgsLoading) && rooms.length === 0 && requirements.length === 0 && pgs.length === 0);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── Header bar ── */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5 bg-white rounded-2xl p-1 border border-gray-100 shadow-sm overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    tab === t.id
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-muted hover:text-dark hover:bg-gray-50'
                  }`}
                >
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowMobileFilters(true)} className="lg:hidden p-2.5 bg-white border border-gray-100 rounded-xl cursor-pointer">
                <Filter size={18} className="text-muted" />
              </button>
              <Link to="/post">
                <Button size="sm" className="rounded-xl hidden sm:flex">
                  <Plus size={15} /> Add Listing <Badge color="green" className="!text-[9px] !px-1.5">FREE</Badge>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="Search city..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
              {filters.location && (
                <button onClick={() => setFilters({ ...filters, location: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-dark cursor-pointer">
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Sort */}
            <div className="relative">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-dark outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none">
                <option value="match">Top Match</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
            {/* Create Team CTA */}
            <Link to="/teams"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
              <UserPlus size={15} /> Create Team
            </Link>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex gap-6">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <Sidebar filters={filters} onFilterChange={setFilters} tab={tab} />
            </div>
          </div>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowMobileFilters(false)} />
                <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="font-semibold">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="cursor-pointer"><X size={20} /></button>
                  </div>
                  <div className="p-4">
                    <Sidebar filters={filters} onFilterChange={(f) => { setFilters(f); setShowMobileFilters(false); }} tab={tab} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {isInitialLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>

                {/* ════ TAB: ALL ════ */}
                {tab === 'all' && (
                  <div className="space-y-8">
                    {requirements.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="font-bold text-dark flex items-center gap-2"><Users size={18} className="text-primary" /> Roommates</h2>
                          <button onClick={() => setTab('roommates')} className="text-primary text-xs font-semibold hover:underline cursor-pointer">View all →</button>
                        </div>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {sortedReqs.slice(0, 3).map((r) => r.createdBy && (
                            <FlatmateCard key={r._id} user={{ ...r.createdBy, reqId: r._id, createdById: r.createdBy?._id, budget: r.budget, city: r.location, preferredGender: r.preferredRoommate?.gender, phoneVisibility: r.phoneVisibility, contactPhone: r.contactPhone }} match={calcMatch({ budget: r.budget, location: r.location, preferredGender: r.preferredRoommate?.gender }, prefs, profile?.city, 'roommate')} />
                          ))}
                        </div>
                      </section>
                    )}
                    {rooms.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="font-bold text-dark flex items-center gap-2"><Home size={18} className="text-primary" /> Rooms</h2>
                          <button onClick={() => setTab('rooms')} className="text-primary text-xs font-semibold hover:underline cursor-pointer">View all →</button>
                        </div>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {sortedRooms.slice(0, 6).map((r) => <RoomCard key={r._id} room={r} />)}
                        </div>
                      </section>
                    )}
                    {pgs.length > 0 && (
                      <section>
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="font-bold text-dark flex items-center gap-2"><Building2 size={18} className="text-primary" /> PG Accommodations</h2>
                          <button onClick={() => setTab('pgs')} className="text-primary text-xs font-semibold hover:underline cursor-pointer">View all →</button>
                        </div>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {sortedPgs.slice(0, 6).map((p) => <PGCard key={p._id} pg={p} match={calcMatch(p, prefs, profile?.city, 'pg')} />)}
                        </div>
                      </section>
                    )}
                    {rooms.length === 0 && requirements.length === 0 && pgs.length === 0 && (
                      <EmptyState icon={SearchX} title="No listings found" description="Try a different city or adjust your filters." />
                    )}
                  </div>
                )}

                {/* ════ TAB: ROOMS ════ */}
                {tab === 'rooms' && (
                  rooms.length === 0 && !roomsLoading ? (
                    <EmptyState icon={SearchX} title="No rooms found" description="Try adjusting your filters or search a different location." />
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sortedRooms.map((r) => <RoomCard key={r._id} room={r} />)}
                      </div>
                      <ScrollSentinel onVisible={loadMoreRooms} loading={roomsLoading} hasMore={roomPag ? roomPag.page < roomPag.pages : false} />
                    </>
                  )
                )}

                {/* ════ TAB: ROOMMATES ════ */}
                {tab === 'roommates' && (
                  requirements.length === 0 && !reqLoading ? (
                    <EmptyState icon={SearchX} title="No roommates found" description="Try a different location or check back later." />
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sortedReqs.map((r) => r.createdBy && (
                          <FlatmateCard key={r._id} user={{ ...r.createdBy, reqId: r._id, createdById: r.createdBy?._id, budget: r.budget, city: r.location, preferredGender: r.preferredRoommate?.gender, phoneVisibility: r.phoneVisibility, contactPhone: r.contactPhone }} match={calcMatch({ budget: r.budget, location: r.location, preferredGender: r.preferredRoommate?.gender }, prefs, profile?.city, 'roommate')} />
                        ))}
                      </div>
                      <ScrollSentinel onVisible={loadMoreRequirements} loading={reqLoading} hasMore={reqPag ? reqPag.page < reqPag.pages : false} />
                    </>
                  )
                )}

                {/* ════ TAB: PG ════ */}
                {tab === 'pgs' && (
                  pgs.length === 0 && !pgsLoading ? (
                    <EmptyState icon={SearchX} title="No PG accommodations found" description="Try a different city." />
                  ) : (
                    <>
                      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sortedPgs.map((p) => <PGCard key={p._id} pg={p} match={calcMatch(p, prefs, profile?.city, 'pg')} />)}
                      </div>
                      <ScrollSentinel onVisible={loadMorePgs} loading={pgsLoading} hasMore={pgPag ? pgPag.page < pgPag.pages : false} />
                    </>
                  )
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
