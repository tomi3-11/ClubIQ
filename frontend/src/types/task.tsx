export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: number;
  activity_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: number;
  due_date: string | null;
  created_at: string;
  assignee_name?: string;
  activity_name?: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  search?: string;
}
