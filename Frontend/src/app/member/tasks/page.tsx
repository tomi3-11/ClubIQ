"use client";

import { useState, useMemo } from "react";
import { Task, TaskFilters as TaskFiltersType, TaskStatus } from "@/types/task";

import { useToast } from "@/hooks/useToast";
import { TaskFilters } from "@/components/member/Tasks/TaskFilters";
import { TaskList } from "@/components/member/Tasks/TaskList";
import { TaskDetailPanel } from "@/components/member/Tasks/TaskDetailsPanel";
import PageShell from "@/components/reusables/PageShell";
import { mockTasks } from "@/mock/tasks";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: "all",
    search: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;
      const matchesSearch =
        !filters.search ||
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
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    if (selectedTask?.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const statusLabels = {
      pending: "Pending",
      in_progress: "In Progress",
      completed: "Completed",
    };

    toast({
      title: "Task updated",
      description: `Status changed to ${statusLabels[newStatus]}`,
    });
  };

  return (
    <PageShell>
      <main className='overflow-y-auto px-3 flex-1 '>
        <div className='py-6'>
          <div className='space-y-6'>
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              taskCounts={taskCounts}
            />

            <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </div>
        </div>
      </main>

      <TaskDetailPanel
        task={selectedTask}
        open={isPanelOpen}
        onClose={handleClosePanel}
        onStatusChange={handleStatusChange}
      />
    </PageShell>
  );
};

export default Index;
