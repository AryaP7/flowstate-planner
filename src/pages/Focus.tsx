import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';

export default function Focus() {
  const { tasks, isLoading } = useTasks();

  const highPriorityTasks = tasks
    .filter(task => !task.completed && task.priorityLevel === 'high')
    .sort((a, b) => (new Date(a.dueDate || 0).getTime()) - (new Date(b.dueDate || 0).getTime()));

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Today's Focus</h1>
          <p className="text-muted-foreground">
            High priority tasks that need your attention
          </p>
        </div>
        <Link to="/tasks/new">
          <Button>Add New Task</Button>
        </Link>
      </div>

      {highPriorityTasks.length > 0 ? (
        highPriorityTasks.map(task => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  <Link 
                    to={`/tasks/${task.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {task.title}
                  </Link>
                </CardTitle>
                <Badge variant={task.priorityLevel === 'high' ? 'destructive' : 'default'}>
                  {task.priorityLevel}
                </Badge>
              </div>
              <CardDescription>
                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <span className="ml-2 text-sm text-muted-foreground">
                  {task.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Circle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No High Priority Tasks</h3>
            <p className="text-muted-foreground text-center mb-4">
              You don't have any high priority tasks for today.
            </p>
            <Link to="/tasks/new">
              <Button>Create New Task</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 