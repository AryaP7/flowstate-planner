import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { EmptyState } from '../common/EmptyState';
import { Trash, Plus, FolderOpen, Users, CalendarClock, CheckSquare, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectListProps {
  projects: Project[];
  showAddButton?: boolean;
  isLoading?: boolean;
}

export function ProjectList({ projects, showAddButton = false, isLoading = false }: ProjectListProps) {
  const { createProject, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  
  const handleCreateProject = () => {
    if (!projectName.trim()) return;
    
    createProject({
      name: projectName,
      description: projectDescription,
      color: getRandomColor()
    });
    
    // Reset form
    setProjectName('');
    setProjectDescription('');
    setIsDialogOpen(false);
  };
  
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsSummaryDialogOpen(true);
  };
  
  // Generate a random color for new projects
  const getRandomColor = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }
  
  if (projects.length === 0 && !showAddButton) {
    return <EmptyState 
      message="No projects found" 
      icon={<FolderOpen className="h-6 w-6 text-muted-foreground" />} 
    />;
  }
  
  return (
    <div>
      {showAddButton && (
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-lg bg-card">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input 
                    id="name" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Enter project description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => {
          let projectTasks = [];
          if (Array.isArray(project.tasks) && project.tasks.length > 0 && typeof project.tasks[0] === 'object') {
            // Use populated tasks array from backend
            projectTasks = project.tasks;
          } else {
            // Fallback: filter global tasks list
            projectTasks = tasks.filter(t => String(t.projectId) === String(project.id));
          }
          const completedTasks = projectTasks.filter(t => t.completed);
          
          // Calculate completion percentage
          const totalTasks = projectTasks.length;
          const completionPercentage = totalTasks > 0
            ? Math.round((completedTasks.length / totalTasks) * 100)
            : 0;
          
          return (
            <Card key={project.id} className="animate-fade-in group hover-scale hover-glow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Delete project
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {project.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" /> Progress
                      </span>
                      <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-3 w-3" />
                      <span>{completedTasks.length}/{totalTasks} tasks</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {projectTasks.some(t => t.dueDate) && (
                        <span className="flex items-center gap-1">
                          <CalendarClock className="h-3 w-3" />
                          <span>Due</span>
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Team</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleViewProject(project)}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  View Project
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="backdrop-blur-lg bg-card">
          <DialogHeader>
            <DialogTitle>{selectedProject?.name} - Pending Tasks</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedProject && (
              (Array.isArray(selectedProject.tasks) && selectedProject.tasks.length > 0 && typeof selectedProject.tasks[0] === 'object')
                ? selectedProject.tasks.filter((t: any) => !t.completed).map((task: any) => (
                    <div key={task.id || task._id} className="flex items-center justify-between py-2 border-b">
                      <span>{task.title}</span>
                      <span className="text-sm text-muted-foreground">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  ))
                : tasks.filter(t => String(t.projectId) === String(selectedProject.id) && !t.completed).map(task => (
                    <div key={task.id} className="flex items-center justify-between py-2 border-b">
                      <span>{task.title}</span>
                      <span className="text-sm text-muted-foreground">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
