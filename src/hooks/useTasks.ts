import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasks } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export function useTasks(params?: { projectId?: string; completed?: boolean; priority?: string; dueDate?: string }) {
  const queryClient = useQueryClient();

  const { data: tasksListRaw = [], isLoading } = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasks.getAll(params).then(res => res.data),
  });
  const tasksList = tasksListRaw.map((task: any) => ({ ...task, id: task._id }));

  const createTask = useMutation({
    mutationFn: (data: any) => tasks.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Task created', description: 'Your task has been added' });
    },
    onError: (error: any) => {
      console.error('Error creating task:', error.response?.data);
      toast({
        title: 'Error creating task',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tasks.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Task updated', description: 'Your task has been updated' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating task',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => tasks.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Task deleted', description: 'Your task has been removed' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting task',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const completeTask = useMutation({
    mutationFn: (id: string) => tasks.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error completing task',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  return {
    tasks: tasksList,
    isLoading,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    deleteTask: deleteTask.mutate,
    completeTask: completeTask.mutate,
  };
} 