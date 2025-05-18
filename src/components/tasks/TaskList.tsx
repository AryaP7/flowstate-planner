import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
  projectView?: boolean;
  isLoading?: boolean;
}

export function TaskList({ 
  tasks, 
  emptyMessage = "No tasks found", 
  projectView = false,
  isLoading = false 
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  // Sort tasks: high priority first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Priority sorting (high → medium → low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Due date sorting (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }
    
    // Created date as fallback
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  
  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
