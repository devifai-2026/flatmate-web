import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function CityAutocomplete({ value, onChange, className, types = 'place', placeholder = 'Search your city' }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const search = (text) => {
    setQuery(text);
    onChange('');

    clearTimeout(debounceRef.current);
    if (text.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?` +
          `access_token=${MAPBOX_TOKEN}&types=${types}&country=in&limit=5`
        );
        const data = await res.json();
        setSuggestions(data.features || []);
        setOpen(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const select = (feature) => {
    const label = feature.place_name;
    setQuery(label);
    onChange(label);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => search(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-dark/10 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => select(s)}
              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-primary/5 cursor-pointer transition-colors"
            >
              <MapPin size={14} className="text-muted flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark truncate">{s.text}</p>
                <p className="text-xs text-muted truncate">{s.place_name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
