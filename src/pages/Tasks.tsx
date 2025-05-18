import { TaskList } from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const Tasks = () => {
  // Get all tasks
  const { tasks: allTasks, isLoading: isLoadingAll } = useTasks();
  
  // Get incomplete tasks
  const { tasks: incompleteTasks, isLoading: isLoadingIncomplete } = useTasks({ completed: false });
  
  // Get completed tasks
  const { tasks: completedTasks, isLoading: isLoadingCompleted } = useTasks({ completed: true });
  
  if (isLoadingAll || isLoadingIncomplete || isLoadingCompleted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="incomplete" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="incomplete">Tasks ({incompleteTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="all">All ({allTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incomplete" className="mt-0">
          <TaskList 
            tasks={incompleteTasks} 
            emptyMessage="No tasks to complete"
            isLoading={isLoadingIncomplete}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <TaskList 
            tasks={completedTasks} 
            emptyMessage="No completed tasks"
            isLoading={isLoadingCompleted}
          />
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <TaskList 
            tasks={allTasks} 
            emptyMessage="No tasks available"
            isLoading={isLoadingAll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
