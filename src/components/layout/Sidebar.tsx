import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderTree, 
  Calendar, 
  Tag, 
  Settings, 
  Users, 
  Star, 
  TrendingUp,
  LogOut,
  Plus,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  Circle,
  Timer,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target as TargetIcon,
  ListChecks,
  FolderKanban,
  CalendarClock,
  LineChart as AnalyticsIcon,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';

export function Sidebar() {
  const location = useLocation();
  const { projects, tasks, currentUser, setState } = useAppContext();
  const { createTask } = useTasks();
  const { createProject } = useProjects();
  const [quickAddType, setQuickAddType] = useState<'task' | 'project'>('task');
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const [settingsName, setSettingsName] = useState(currentUser?.name || '');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  
  // Calculate counts
  const incompleteTasks = tasks.filter(task => !task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priorityLevel === 'high' && !task.completed).length;

  // Calculate total project tasks for sidebar
  let totalProjectTasks = 0;
  if (projects.length > 0 && projects[0].tasks) {
    totalProjectTasks = projects.reduce((sum, project) => {
      if (Array.isArray(project.tasks)) {
        return sum + project.tasks.length;
      }
      return sum;
    }, 0);
  } else {
    totalProjectTasks = tasks.length;
  }
  
  // Handle quick add submission
  const handleQuickAdd = () => {
    if (!quickAddTitle.trim() || !currentUser) return;
    
    if (quickAddType === 'task') {
      createTask({
        title: quickAddTitle,
        description: '',
        completed: false,
        priorityLevel: 'medium',
        dueDate: new Date(),
        projectId: null,
        userId: currentUser.id
      });
    } else {
      createProject({
        name: quickAddTitle,
        description: '',
      });
    }
    
    setQuickAddTitle('');
    setIsQuickAddOpen(false);
  };
  
  // Navigation items
  const primaryNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your productivity',
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: ListChecks,
      count: incompleteTasks,
      description: 'Manage your tasks',
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban,
      count: totalProjectTasks,
      description: 'Your project portfolio',
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: CalendarClock,
      description: 'Schedule and deadlines',
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: AnalyticsIcon,
      description: 'Track your progress',
    }
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    {
      name: "Today's Focus",
      path: '/focus',
      icon: TargetIcon,
      count: highPriorityTasks,
      description: 'High priority tasks for today',
    }
  ];

  return (
    <div className="h-screen w-64 border-r bg-card flex flex-col transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold">TaskFlow</h2>
        </div>
        <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full mt-6 justify-start text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5 mr-3" />
              <span className="text-base">Quick Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Add</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={quickAddType === 'task' ? 'default' : 'outline'}
                  onClick={() => setQuickAddType('task')}
                  className="transition-all duration-200"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Task
                </Button>
                <Button
                  variant={quickAddType === 'project' ? 'default' : 'outline'}
                  onClick={() => setQuickAddType('project')}
                  className="transition-all duration-200"
                >
                  <FolderTree className="h-4 w-4 mr-2" />
                  Project
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">
                  {quickAddType === 'task' ? 'Task Title' : 'Project Name'}
                </Label>
                <Input
                  id="title"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  placeholder={quickAddType === 'task' ? 'Enter task title...' : 'Enter project name...'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleQuickAdd();
                    }
                  }}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              <Button 
                onClick={handleQuickAdd}
                className="transition-all duration-200 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {quickAddType === 'task' ? 'Task' : 'Project'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {primaryNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-2 rounded-md text-sm group transition-all duration-200 hover:bg-secondary hover:scale-[1.02]",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <item.icon className={cn(
                        "mr-4 h-6 w-6 transition-colors duration-200",
                        location.pathname === item.path
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="text-base">{item.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {item.count !== undefined && location.pathname !== '/auth' && (
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary-foreground text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>
        
        <div className="mt-6 space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                "flex items-center justify-between px-4 py-2 rounded-md text-sm group transition-all duration-200 hover:bg-secondary hover:scale-[1.02]",
                  location.pathname === item.path
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <item.icon className={cn(
                        "mr-4 h-6 w-6 transition-colors duration-200",
                        location.pathname === item.path
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span className="text-base">{item.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {item.count !== undefined && location.pathname !== '/auth' && (
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary-foreground text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.count}
                </span>
              )}
              </Link>
            ))}
        </div>
        
        {highPriorityTasks > 0 && location.pathname !== '/auth' && (
          <div className="mx-3 mt-6">
            <div className="p-4 rounded-md border border-border" style={{ background: '#1a1a1a' }}>
              <div className="flex items-center mb-3">
                <Timer className="h-5 w-5 mr-3 animate-pulse text-yellow-400" />
                <span className="font-semibold text-base text-yellow-400">Attention Required</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You have <span className="font-medium text-foreground">{highPriorityTasks}</span> high priority tasks that need your attention.
              </p>
                <p className="text-sm text-muted-foreground">
                  These tasks are marked as urgent and should be addressed soon.
                </p>
              </div>
              <Link 
                to="/tasks" 
                className="mt-4 text-sm text-primary font-medium block hover:underline transition-all duration-200 flex items-center"
              >
                View tasks
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="ml-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Only show settings and log out if not on /auth */}
      {location.pathname !== '/auth' && (
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold text-lg">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="text-base font-medium">{currentUser?.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            </div>
            </div>
            <Button variant="ghost" size="icon" className="h-10 w-10 transition-all duration-200 hover:scale-110" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full justify-start mt-4 text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-[1.02]"
            onClick={() => {
              setState(prev => ({ ...prev, currentUser: null }));
              navigate('/login');
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-base">Log out</span>
          </Button>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6">
                <div>
                  <Label className="mb-2 block">Theme</Label>
                  <ThemeToggle />
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setState(prev => ({
                      ...prev,
                      currentUser: prev.currentUser ? { ...prev.currentUser, name: settingsName } : prev.currentUser
                    }));
                    setSettingsSuccess('Display name updated!');
                    setTimeout(() => setSettingsSuccess(''), 2000);
                  }}
                  className="space-y-2"
                >
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={settingsName}
                    onChange={e => setSettingsName(e.target.value)}
                    className="w-full"
                  />
                  <Button type="submit" className="mt-2">Update Name</Button>
                  {settingsSuccess && <div className="text-green-600 text-sm mt-2">{settingsSuccess}</div>}
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
