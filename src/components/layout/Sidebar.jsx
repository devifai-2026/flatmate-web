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

/**
 * Compact filter sidebar — dynamic per tab.
 * @param {string} tab - 'all' | 'rooms' | 'roommates' | 'pgs'
 */
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
      {(tab === 'rooms') && (
        <Section title="Preferred Tenant">
          <select value={filters.preferredTenant || ''} onChange={(e) => update('preferredTenant', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="family">Family</option>
            <option value="students">Students</option>
            <option value="working-professionals">Working Professionals</option>
          </select>
        </Section>
      )}

      {/* ── ROOMMATES ── */}
      {(tab === 'roommates') && (
        <>
          <Section title="Roommate Preference">
            <select value={filters.gender || ''} onChange={(e) => update('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
              <option value="">Any Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select value={filters.sleepSchedule || ''} onChange={(e) => update('sleepSchedule', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
              <option value="">Any Schedule</option>
              <option value="early-bird">Early Bird</option>
              <option value="night-owl">Night Owl</option>
              <option value="flexible">Flexible</option>
            </select>
          </Section>

          <Section title="Lifestyle" defaultOpen={false}>
            <div className="space-y-1.5">
              {[
                { key: 'smoking', label: 'Non-smoking' },
                { key: 'drinking', label: 'Non-drinking' },
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
      {(tab === 'pgs') && (
        <Section title="PG Preferences">
          <select value={filters.pgGender || ''} onChange={(e) => update('pgGender', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
          <select value={filters.sharing || ''} onChange={(e) => update('sharing', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
            <option value="">Any Sharing</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={filters.meals || false} onChange={(e) => update('meals', e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-xs text-muted">Meals included</span>
          </label>
        </Section>
      )}

      {/* ── ALL tab — show compact combined ── */}
      {tab === 'all' && (
        <Section title="Quick Filters" defaultOpen={false}>
          <select value={filters.gender || ''} onChange={(e) => update('gender', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-dark/8 bg-white text-sm outline-none focus:border-primary/40">
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Section>
      )}

      <div className="flex gap-2 pt-1">
        <Button size="sm" className="flex-1 !text-xs !py-2" onClick={() => onFilterChange(filters)}>Apply</Button>
        <Button variant="ghost" size="sm" className="flex-1 !text-xs !py-2" onClick={() => onFilterChange({ location: filters.location })}>Reset</Button>
      </div>
    </div>
  );
}
