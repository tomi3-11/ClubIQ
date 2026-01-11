"use client";

import { useState, useMemo } from 'react';
import { Task, TaskFilters as TaskFiltersType, TaskStatus } from '@/types/task';
import { useUser } from "@clerk/nextjs";
import useSignOut from "@/hooks/useSignOut";

// Dashboard Components
import Sidebar from "@/components/reusables/Sidebar";
import "../../../styles/dashboard.css"; // Ensure this path matches your dashboard styling

// Task Components
import { useToast } from '@/hooks/useToast';
import { TaskFilters } from '@/components/member/Tasks/TaskFilters';
import { TaskList } from '@/components/member/Tasks/TaskList';
import { TaskDetailPanel } from '@/components/member/Tasks/TaskDetailsPanel';

export const mockTasks: Task[] = [

  {

    id: 1,

    activity_id: 101,

    title: 'Prepare event venue',

    description: 'Set up chairs, tables, and decorations for the annual club meetup. Coordinate with vendors for equipment delivery.',

    status: 'completed',

    assigned_to: 1,

    due_date: '2024-01-15',

    created_at: '2024-01-10T09:00:00Z',

    assignee_name: 'Alex Chen',

    activity_name: 'Annual Meetup'

  },

  {

    id: 2,

    activity_id: 101,

    title: 'Send invitations to members',

    description: 'Draft and send email invitations to all club members. Include event details, RSVP link, and dress code information.',

    status: 'in_progress',

    assigned_to: 2,

    due_date: '2024-01-20',

    created_at: '2024-01-12T14:30:00Z',

    assignee_name: 'Sarah Kim',

    activity_name: 'Annual Meetup'

  },

  {

    id: 3,

    activity_id: 102,

    title: 'Order catering services',

    description: 'Contact catering companies and finalize menu for 50 attendees. Consider dietary restrictions.',

    status: 'pending',

    assigned_to: 3,

    due_date: '2024-01-25',

    created_at: '2024-01-14T10:15:00Z',

    assignee_name: 'Mike Johnson',

    activity_name: 'Workshop Event'

  },

  {

    id: 4,

    activity_id: 102,

    title: 'Create presentation slides',

    description: 'Design and prepare presentation materials for the workshop session on project management best practices.',

    status: 'in_progress',

    assigned_to: 1,

    due_date: '2024-01-22',

    created_at: '2024-01-13T16:00:00Z',

    assignee_name: 'Alex Chen',

    activity_name: 'Workshop Event'

  },

  {

    id: 5,

    activity_id: 103,

    title: 'Book meeting room',

    description: null,

    status: 'completed',

    assigned_to: 2,

    due_date: '2024-01-18',

    created_at: '2024-01-11T08:45:00Z',

    assignee_name: 'Sarah Kim',

    activity_name: 'Monthly Review'

  },

  {

    id: 6,

    activity_id: 103,

    title: 'Prepare financial report',

    description: 'Compile quarterly financial statements and budget analysis for the monthly review meeting.',

    status: 'pending',

    assigned_to: 4,

    due_date: '2024-01-28',

    created_at: '2024-01-15T11:20:00Z',

    assignee_name: 'Emma Davis',

    activity_name: 'Monthly Review'

  },

];

const Index = () => {
  const { user } = useUser();
  const { handleSignOut } = useSignOut();
  const { toast } = useToast();

  // Dashboard State
  const [activeTab, setActiveTab] = useState("tasks");

  // Task State
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<TaskFiltersType>({ status: 'all', search: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status;
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filters]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus } : null);
    }

    const statusLabels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    };

    toast({
      title: 'Task updated',
      description: `Status changed to ${statusLabels[newStatus]}`,
    });
  };

  return (
    <div className='dashboard-container'>
      <Sidebar
        role='member'
        onLogout={handleSignOut}
        activeTab={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
      />

      <main className='overflow-y-auto px-3 flex-1 '>
        <header className='dashboard-header'>
          <div className='header-content'>
            <h1>Welcome, {user?.username}!</h1>
            <p>Manage and track your activity tasks</p>
          </div>
          <button className='btn btn-outline' onClick={handleSignOut}>
            Logout
          </button>
        </header>

        <div className='dashboard-tabs'>
          <button
            className={`tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks
          </button>
          <button
            className={`tab ${activeTab === "activities" ? "active" : ""}`}
            onClick={() => setActiveTab("activities")}
          >
            My Activities
          </button>
          <button
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </div>

        {/* Task Content Area */}
        <div className="py-6">
          <div className="space-y-6">
            <TaskFilters
              filters={filters} 
              onFiltersChange={setFilters} 
              taskCounts={taskCounts}
            />
            
            <TaskList
              tasks={filteredTasks} 
              onTaskClick={handleTaskClick} 
            />
          </div>
        </div>
      </main>

      <TaskDetailPanel
        task={selectedTask}
        open={isPanelOpen}
        onClose={handleClosePanel}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Index;