export default function Input({ label, error, icon: Icon, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-dark">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`w-full px-4 py-2.5 rounded-xl border bg-white text-dark placeholder-muted/60 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${Icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200'}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
