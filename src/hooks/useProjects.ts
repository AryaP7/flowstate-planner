import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projects } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projectsListRaw = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projects.getAll().then(res => res.data),
  });
  const projectsList = projectsListRaw.map((project: any) => ({ ...project, id: project._id }));

  const createProject = useMutation({
    mutationFn: (data: any) => projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project created', description: 'Your project has been added' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating project',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => projects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Project updated', description: 'Your project has been updated' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating project',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: 'Project deleted', description: 'Your project has been removed' });
    },
    onError: (error: any) => {
      console.error('Error deleting project:', error.response?.data);
      toast({
        title: 'Error deleting project',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  return {
    projects: projectsList,
    isLoading,
    createProject: createProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
  };
} 