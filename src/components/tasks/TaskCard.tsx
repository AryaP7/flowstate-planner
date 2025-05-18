import { CheckCircle, Circle, Trash, CalendarClock, Tag, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useAppContext } from '@/context/AppContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTasks();
  const { tags, taskTags } = useAppContext();
  
  // Get tags for this task
  const taskTagIds = taskTags.filter(tt => tt.taskId === task.id).map(tt => tt.tagId);
  const taskTagDetails = tags.filter(tag => taskTagIds.includes(tag.id));
  
  const priorityClasses = {
    low: 'task-priority-low',
    medium: 'task-priority-medium',
    high: 'task-priority-high'
  };
  
  const priorityIcons = {
    low: <Circle className="h-3 w-3 text-task-low" />,
    medium: <Clock className="h-3 w-3 text-task-medium" />,
    high: <AlertTriangle className="h-3 w-3 text-task-high" />
  };
  
  const priorityLabels = {
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority"
  };
  
  return (
    <div 
      className={cn(
        "bg-card rounded-lg shadow-sm p-4 animate-fade-in hover:shadow-md transition-all group",
        priorityClasses[task.priorityLevel],
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => completeTask(task.id)}
                className="mt-1 shrink-0"
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {task.completed ? "Mark as incomplete" : "Mark as complete"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-medium text-base flex items-center",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      {priorityIcons[task.priorityLevel]}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {priorityLabels[task.priorityLevel]}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Delete task
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1 flex-wrap">
              {taskTagDetails.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  style={{ borderColor: tag.color, color: tag.color }}
                  className="bg-transparent text-xs font-normal flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </Badge>
              ))}
            </div>
            
            {task.dueDate && (
              <span className="text-xs text-muted-foreground flex items-center">
                <CalendarClock className="h-3 w-3 mr-1" />
                Due {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
