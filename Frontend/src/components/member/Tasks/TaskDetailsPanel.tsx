import { Task, TaskStatus } from '@/types/task';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Folder, Clock, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
}

export const TaskDetailPanel = ({ task, open, onClose, onStatusChange }: TaskDetailPanelProps) => {
  if (!task) return null;

  const formattedDate = task.due_date 
    ? format(new Date(task.due_date), 'EEEE, MMMM d, yyyy')
    : 'No due date';

  const createdDate = format(new Date(task.created_at), 'MMM d, yyyy \'at\' h:mm a');

  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status !== 'completed';

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-xl font-semibold text-foreground leading-tight">
                {task.title}
              </SheetTitle>
            </div>
          </div>
          
          <StatusBadge status={task.status} className="w-fit" />
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            {task.status !== 'completed' && (
              <Button 
                onClick={() => onStatusChange(task.id, 'completed')}
                className="flex-1"
                variant="default"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
            {task.status === 'completed' && (
              <Button 
                onClick={() => onStatusChange(task.id, 'pending')}
                className="flex-1"
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Reopen Task
              </Button>
            )}
          </div>

          <Separator />

          {/* Status Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select 
              value={task.status} 
              onValueChange={(value) => onStatusChange(task.id, value as TaskStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-pending" />
                    Pending
                  </span>
                </SelectItem>
                <SelectItem value="in_progress">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-in-progress" />
                    In Progress
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-status-completed" />
                    Completed
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Details</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Folder className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Activity</p>
                  <p className="text-foreground">{task.activity_name || 'Unknown'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned to</p>
                  <p className="text-foreground">{task.assignee_name || 'Unassigned'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isOverdue ? "bg-destructive/10" : "bg-muted"
                )}>
                  <Calendar className={cn(
                    "w-4 h-4",
                    isOverdue ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Due date</p>
                  <p className={cn(
                    isOverdue ? "text-destructive font-medium" : "text-foreground"
                  )}>
                    {formattedDate}
                    {isOverdue && ' (Overdue)'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-foreground">{createdDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
