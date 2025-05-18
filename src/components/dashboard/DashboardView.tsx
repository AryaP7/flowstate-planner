import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectList } from '../projects/ProjectList';
import { TaskList } from '../tasks/TaskList';
import { 
  Calendar, 
  CheckSquare,
  Clock, 
  Flag, 
  TrendingUp,
  BarChart,
  Activity,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '../ui/progress';

export function DashboardView() {
  const { tasks = [], projects = [] } = useAppContext();
  
  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get tasks due today
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const tasksDueToday = tasks.filter(task => 
    task.dueDate && format(task.dueDate, 'yyyy-MM-dd') === todayString && !task.completed
  );
  
  // Get high priority tasks
  const highPriorityTasks = tasks.filter(task => 
    task.priorityLevel === 'high' && !task.completed
  );
  
  // Get recent projects (last 3)
  const recentProjects = [...projects]
    .filter(p => p && p.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Message */}
      <div className="glass-card p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {useAppContext().currentUser?.name}!</h1>
        <p className="text-muted-foreground">Today is {format(today, 'EEEE, MMMM d, yyyy')}</p>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-primary mr-2" />
            <div className="text-sm">
              <span className="text-muted-foreground">Weekly Productivity:</span> 
              <span className="ml-1 font-medium">{completionRate}% Complete</span>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            <Progress value={completionRate} className="h-2 w-32" />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="icon-container">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTasks}</div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">All time tasks</p>
              <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                {tasks.filter(t => !t.completed).length} Active
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <div className="icon-container">
              <BarChart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <div className="mt-3">
              <Progress value={completionRate} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <div className="icon-container">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasksDueToday.length}</div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Tasks to complete today</p>
              {tasksDueToday.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Due Today
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-scale hover-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <div className="icon-container bg-destructive/10 text-destructive">
              <Flag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{highPriorityTasks.length}</div>
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Tasks needing attention</p>
              {highPriorityTasks.length > 0 && (
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                  Urgent
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">Recent Projects</h2>
          </div>
          <ProjectList projects={recentProjects} />
        </div>
        
        <div className="space-y-6">
          {/* Tasks Due Today */}
          <div>
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-semibold">Due Today</h2>
            </div>
            <TaskList 
              tasks={tasksDueToday} 
              emptyMessage="No tasks due today" 
            />
          </div>
          
          {/* High Priority Tasks */}
          <div>
            <div className="flex items-center mb-4">
              <Flag className="h-5 w-5 mr-2 text-destructive" />
              <h2 className="text-xl font-semibold">High Priority</h2>
            </div>
            <TaskList 
              tasks={highPriorityTasks} 
              emptyMessage="No high priority tasks" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
