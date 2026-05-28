import { Task } from '@/types/task';
import { StatusBadge } from './StatusBadge';
import { Card } from '@/components/ui/card';
import { Calendar, User, Folder } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const formattedDate = task.due_date 
    ? format(new Date(task.due_date), 'MMM d, yyyy')
    : null;

  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== 'completed';

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer task-card-hover border bg-card",
        task.status === 'completed' && "opacity-75"
      )}
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-foreground truncate",
            task.status === 'completed' && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
            {task.activity_name && (
              <span className="flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" />
                {task.activity_name}
              </span>
            )}
            
            {task.assignee_name && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {task.assignee_name}
              </span>
            )}
            
            {formattedDate && (
              <span className={cn(
                "flex items-center gap-1",
                isOverdue && "text-destructive font-medium"
              )}>
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
                {isOverdue && " (Overdue)"}
              </span>
            )}
          </div>
        </div>
        
        <StatusBadge status={task.status} />
      </div>
    </Card>
  );
};
