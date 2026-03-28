import { useState } from 'react';
import { MapPin, IndianRupee, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LIFESTYLE_TAGS } from '../../utils/constants';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-sm font-medium text-dark mb-1.5 cursor-pointer">
        {title}
        <ChevronDown size={14} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder = 'Any' }) {
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o.charAt(0).toUpperCase() + o.slice(1).replace(/-/g, ' ') : o.label}
        </option>
      ))}
    </select>
  );
}

export default function Sidebar({ filters, onFilterChange, tab = 'all' }) {
  const update = (key, value) => onFilterChange({ ...filters, [key]: value });

  const toggleTag = (id) => {
    const current = filters.lifestyleTags || [];
    const updated = current.includes(id) ? current.filter((t) => t !== id) : [...current, id];
    update('lifestyleTags', updated);
  };

  return (
    <div className="bg-white rounded-2xl p-4 space-y-4 shadow-sm border border-dark/6">
      <h3 className="font-semibold text-dark text-sm">Filters</h3>

      {/* Location — always */}
      <Input label="Location" icon={MapPin} placeholder="e.g. Mumbai" value={filters.location || ''} onChange={(e) => update('location', e.target.value)} />

      {/* Budget — always */}
      <Section title="Budget Range">
        <div className="flex gap-2">
          <Input icon={IndianRupee} placeholder="Min" type="number" value={filters.minBudget || ''} onChange={(e) => update('minBudget', e.target.value)} />
          <Input icon={IndianRupee} placeholder="Max" type="number" value={filters.maxBudget || ''} onChange={(e) => update('maxBudget', e.target.value)} />
        </div>
      </Section>

      {/* ── ROOMS ── */}
      {tab === 'rooms' && (
        <>
          <Section title="Room Type">
            <div className="flex flex-wrap gap-1.5">
              {[{ id: '', label: 'Any' }, { id: '1rk', label: '1RK' }, { id: '1bhk', label: '1BHK' }, { id: '2bhk', label: '2BHK' }, { id: '3bhk', label: '3BHK' }, { id: '4bhk+', label: '4BHK+' }, { id: 'single-room', label: 'Single' }, { id: 'shared-room', label: 'Shared' }].map((t) => (
                <button key={t.id} onClick={() => update('roomType', t.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${filters.roomType === t.id || (!filters.roomType && t.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Furnishing">
            <div className="flex gap-1.5">
              {[{ id: '', label: 'Any' }, { id: 'fully-furnished', label: 'Furnished' }, { id: 'semi-furnished', label: 'Semi' }, { id: 'unfurnished', label: 'Unfurnished' }].map((f) => (
                <button key={f.id} onClick={() => update('furnishing', f.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${filters.furnishing === f.id || (!filters.furnishing && f.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Preferred Tenant">
            <Select value={filters.preferredTenant} onChange={(v) => update('preferredTenant', v)}
              options={[
                { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' },
                { value: 'family', label: 'Family' }, { value: 'students', label: 'Students' },
                { value: 'working-professionals', label: 'Working Professionals' },
              ]} />
          </Section>

          <Section title="Parking" defaultOpen={false}>
            <div className="flex gap-1.5">
              {[{ id: '', label: 'Any' }, { id: 'bike', label: '🏍️ Bike' }, { id: 'car', label: '🚗 Car' }, { id: 'both', label: 'Both' }].map((p) => (
                <button key={p.id} onClick={() => update('parking', p.id)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${filters.parking === p.id || (!filters.parking && p.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ── ROOMMATES ── */}
      {tab === 'roommates' && (
        <>
          <Section title="Gender">
            <Select value={filters.gender} onChange={(v) => update('gender', v)}
              options={['male', 'female', 'non-binary']} placeholder="Any Gender" />
          </Section>

          <Section title="Food Preference">
            <div className="flex flex-wrap gap-1.5">
              {[{ id: '', label: 'Any' }, { id: 'veg', label: '🟢 Veg' }, { id: 'non-veg', label: '🔴 Non-Veg' }, { id: 'eggetarian', label: '🟡 Egg' }, { id: 'vegan', label: '🌿 Vegan' }].map((f) => (
                <button key={f.id} onClick={() => update('foodPreference', f.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all ${filters.foodPreference === f.id || (!filters.foodPreference && f.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Religion" defaultOpen={false}>
            <Select value={filters.religion} onChange={(v) => update('religion', v)}
              options={[
                { value: 'hindu', label: 'Hindu' }, { value: 'muslim', label: 'Muslim' },
                { value: 'christian', label: 'Christian' }, { value: 'sikh', label: 'Sikh' },
                { value: 'jain', label: 'Jain' }, { value: 'buddhist', label: 'Buddhist' },
                { value: 'no-preference', label: 'No Preference' },
              ]} placeholder="Any Religion" />
          </Section>

          <Section title="Occupation" defaultOpen={false}>
            <Select value={filters.occupation} onChange={(v) => update('occupation', v)}
              options={[
                { value: 'student', label: 'Student' }, { value: 'working-professional', label: 'Working Professional' },
                { value: 'freelancer', label: 'Freelancer' }, { value: 'business', label: 'Business' },
              ]} placeholder="Any Occupation" />
          </Section>

          <Section title="Room Type" defaultOpen={false}>
            <div className="flex gap-2">
              {[{ id: '', label: 'Any' }, { id: 'single', label: 'Single' }, { id: 'shared', label: 'Shared' }].map((r) => (
                <button key={r.id} onClick={() => update('roomType', r.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${filters.roomType === r.id || (!filters.roomType && r.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Schedule">
            <Select value={filters.sleepSchedule} onChange={(v) => update('sleepSchedule', v)}
              options={[
                { value: 'early-bird', label: '🌅 Early Bird' }, { value: 'night-owl', label: '🦉 Night Owl' },
                { value: 'flexible', label: '🔄 Flexible' },
              ]} placeholder="Any Schedule" />
          </Section>

          <Section title="Lifestyle" defaultOpen={false}>
            <div className="space-y-1.5">
              {[
                { key: 'smoking', label: 'Non-smoking only' },
                { key: 'drinking', label: 'Non-drinking only' },
                { key: 'pets', label: 'Pet-friendly' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters[key] || false} onChange={(e) => update(key, e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs text-muted">{label}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section title="Tags" defaultOpen={false}>
            <div className="flex flex-wrap gap-1">
              {LIFESTYLE_TAGS.map((tag) => {
                const on = (filters.lifestyleTags || []).includes(tag.id);
                return (
                  <button key={tag.id} onClick={() => toggleTag(tag.id)}
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all ${
                      on ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'
                    }`}>
                    {tag.emoji} {tag.label}
                  </button>
                );
              })}
            </div>
          </Section>
        </>
      )}

      {/* ── PG ── */}
      {tab === 'pgs' && (
        <>
          <Section title="Gender">
            <Select value={filters.pgGender} onChange={(v) => update('pgGender', v)}
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'unisex', label: 'Unisex' }]}
              placeholder="Any Gender" />
          </Section>

          <Section title="Sharing">
            <div className="flex gap-2">
              {[{ id: '', label: 'Any' }, { id: 'single', label: 'Single' }, { id: 'double', label: 'Double' }, { id: 'triple', label: 'Triple' }].map((s) => (
                <button key={s.id} onClick={() => update('sharing', s.id)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-semibold cursor-pointer transition-all ${filters.sharing === s.id || (!filters.sharing && s.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Meals">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.meals || false} onChange={(e) => update('meals', e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-xs text-muted">Meals included only</span>
            </label>
            {filters.meals && (
              <div className="flex gap-1.5 mt-1">
                {[{ id: '', label: 'Any' }, { id: 'veg', label: '🟢 Veg' }, { id: 'non-veg', label: '🔴 Non-Veg' }, { id: 'both', label: '🟡 Both' }].map((m) => (
                  <button key={m.id} onClick={() => update('mealType', m.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${filters.mealType === m.id || (!filters.mealType && m.id === '') ? 'bg-primary text-white' : 'bg-surface text-muted hover:bg-dark/5'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      {/* ── ALL tab — no sidebar filters, use top search bar ── */}

      <div className="flex gap-2 pt-1">
        <Button size="sm" className="flex-1 !text-xs !py-2" onClick={() => onFilterChange(filters)}>Apply</Button>
        <Button variant="ghost" size="sm" className="flex-1 !text-xs !py-2" onClick={() => onFilterChange({ location: filters.location })}>Reset</Button>
      </div>
    </div>
  );
}
