import { useQuery } from '@tanstack/react-query';
import { analytics } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export function useAnalytics() {
  const { data: projectStats = [], isLoading, error } = useQuery({
    queryKey: ['analytics', 'projects'],
    queryFn: () => analytics.getProjectStats().then(res => res.data),
  });

  if (error) {
    return {
      projectStats: [],
      isLoading: false,
      error,
    };
  }

  return {
    projectStats,
    isLoading,
    error: null,
  };
} 