import { ProjectList } from '@/components/projects/ProjectList';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

const Projects = () => {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
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
      <ProjectList projects={projects} showAddButton={true} isLoading={isLoading} />
    </div>
  );
};

export default Projects;
