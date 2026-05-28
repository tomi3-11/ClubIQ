import { TaskStatus } from '@/types/task';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Circle,
    className: 'status-pending',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'status-in-progress',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'status-completed',
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn('status-badge', config.className, className)}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};
