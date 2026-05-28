import { TaskFilters as TaskFiltersType, TaskStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  taskCounts: { all: number; pending: number; in_progress: number; completed: number };
}

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const TaskFilters = ({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9 bg-card"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <ListFilter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1 flex-wrap">
          {statusOptions.map((option) => {
            const count = taskCounts[option.value as keyof typeof taskCounts];
            const isActive = (filters.status || 'all') === option.value;
            
            return (
              <Button
                key={option.value}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, status: option.value })}
                className={cn(
                  "h-8 px-3 text-xs font-medium",
                  !isActive && "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
                <span className={cn(
                  "ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]",
                  isActive 
                    ? "bg-primary-foreground/20 text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
