import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tags } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export function useTags() {
  const queryClient = useQueryClient();

  const { data: tagsListRaw = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tags.getAll().then(res => res.data),
  });
  const tagsList = tagsListRaw.map((tag: any) => ({ ...tag, id: tag._id }));

  const createTag = useMutation({
    mutationFn: (data: any) => tags.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({ title: 'Tag created', description: 'Your tag has been added' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating tag',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const updateTag = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tags.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({ title: 'Tag updated', description: 'Your tag has been updated' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating tag',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const deleteTag = useMutation({
    mutationFn: (id: string) => tags.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({ title: 'Tag deleted', description: 'Your tag has been removed' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting tag',
        description: error.response?.data?.error || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  return {
    tags: tagsList,
    isLoading,
    createTag: createTag.mutate,
    updateTag: updateTag.mutate,
    deleteTag: deleteTag.mutate,
  };
} 