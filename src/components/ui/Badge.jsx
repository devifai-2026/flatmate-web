const colors = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-primary/10 text-primary',
  gray: 'bg-gray-100 text-muted',
  green: 'bg-primary/10 text-primary',
  red: 'bg-red-50 text-red-500',
};

export default function Badge({ children, color = 'primary', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
