import { motion } from 'framer-motion';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Icon size={36} className="text-primary" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-dark mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </motion.div>
  );
}
