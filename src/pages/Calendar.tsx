import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskList } from '@/components/tasks/TaskList';
import { format, isToday, addDays } from 'date-fns';
import { CalendarClock, ListTodo, ArrowDown, ArrowUp, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

// Helper: Get current date in IST (date-only)
function getISTToday() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + istOffset);
  return new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
}

function toISTDate(date: Date | string | undefined) {
  if (!date) return new Date('Invalid');
  const d = new Date(date);
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(d.getTime() + istOffset);
}

function isSameISTDay(dateA: Date | string | undefined, dateB: Date | string | undefined) {
  if (!dateA || !dateB) return false;
  const a = toISTDate(dateA);
  const b = toISTDate(dateB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPage() {
  const { tasks, isLoading: isLoadingTasks } = useTasks();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const istToday = getISTToday();
  const [selectedDate, setSelectedDate] = useState<Date>(istToday);
  const [month, setMonth] = useState<Date>(istToday);
  const [view, setView] = useState<'day' | 'month'>('day');

  // Get tasks with due dates
  const tasksWithDueDates = useMemo(() => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return !isNaN(dueDate.getTime());
    });
  }, [tasks]);

  // Get tasks for selected date (IST, date-only)
  const tasksForSelectedDate = useMemo(() => {
    return tasksWithDueDates.filter(task => {
      if (!task.dueDate) return false;
      return isSameISTDay(task.dueDate, selectedDate);
    });
  }, [tasksWithDueDates, selectedDate]);

  // Get tasks for the current month (IST, date-only)
  const tasksForCurrentMonth = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return tasksWithDueDates.filter(task => {
      const taskDate = toISTDate(task.dueDate);
      return taskDate >= firstDay && taskDate <= lastDay;
    });
  }, [tasksWithDueDates, month]);

  // Get upcoming tasks (today + next 7 days, IST)
  const upcomingTasks = useMemo(() => {
    const today = istToday;
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return tasksWithDueDates
      .filter(task => {
        if (!task.dueDate) return false;
        const taskDate = toISTDate(task.dueDate);
        return (taskDate >= today) && (taskDate < nextWeek);
      })
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return toISTDate(a.dueDate).getTime() - toISTDate(b.dueDate).getTime();
      });
  }, [tasksWithDueDates, istToday]);

  // Calculate task count by date for the current month
  const taskCountByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    tasksForCurrentMonth.forEach(task => {
      const dateStr = new Date(task.dueDate!).toISOString().split('T')[0];
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });
    return counts;
  }, [tasksForCurrentMonth]);

  // Get high priority tasks for the current month
  const priorityTasksByDate = useMemo(() => {
    const priorityTasks: Record<string, boolean> = {};
    tasksForCurrentMonth.forEach(task => {
      if (task.priorityLevel === 'high') {
        const dateStr = new Date(task.dueDate!).toISOString().split('T')[0];
        priorityTasks[dateStr] = true;
      }
    });
    return priorityTasks;
  }, [tasksForCurrentMonth]);

  // Sort tasks for the selected date by priority and due date
  const sortedTasksForDate = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...tasksForSelectedDate].sort((a, b) => {
      const priorityDiff = priorityOrder[a.priorityLevel] - priorityOrder[b.priorityLevel];
      if (priorityDiff !== 0) return priorityDiff;
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });
  }, [tasksForSelectedDate]);

  // Navigation helpers
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(today);
  };

  const goToPreviousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  // Custom day renderer
  const DayContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasTasks = taskCountByDate[dateStr] > 0;
    const isHighPriority = priorityTasksByDate[dateStr];
    const isSelected = isSameISTDay(date, selectedDate);
    const dayIsToday = isSameISTDay(date, istToday);
    const tasksForDay = tasksWithDueDates.filter(task => {
      const taskDate = toISTDate(task.dueDate);
      return isSameISTDay(taskDate, date);
    });
    let ringColor = '';
    if (isSelected) {
      ringColor = 'ring-2 ring-accent';
    } else if (isHighPriority) {
      ringColor = 'ring-2 ring-task-high';
    } else if (hasTasks) {
      ringColor = 'ring-2 ring-primary';
    }
    return (
      <div className="relative h-full w-full flex flex-col items-center justify-center p-1">
        <div className={`relative flex items-center justify-center w-7 h-7 rounded-full z-10 ${ringColor}`} style={{ aspectRatio: '1/1' }}>
          {dayIsToday && (
            <span className="absolute inset-0 w-full h-full rounded-full bg-green-500/30 z-0" style={{ aspectRatio: '1/1' }} />
          )}
          <span className={`relative z-10 text-sm ${hasTasks ? 'font-semibold' : ''}`}>{date.getDate()}</span>
        </div>
        {tasksForDay.length > 0 && (
          <div className="mt-1 flex flex-col items-center w-full">
            <div className="flex items-center gap-1 w-full justify-center">
              <span className={`inline-block w-2 h-2 rounded-full ${
                tasksForDay[0].priorityLevel === 'high'
                  ? 'bg-task-high'
                  : tasksForDay[0].priorityLevel === 'medium'
                  ? 'bg-task-medium'
                  : 'bg-task-low'
              }`} />
              <span className="truncate text-xs text-muted-foreground max-w-[48px]">
                {tasksForDay[0].title}
              </span>
            </div>
            {tasksForDay.length > 1 && (
              <span className="text-[10px] text-muted-foreground">+{tasksForDay.length - 1} more</span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoadingTasks || isLoadingProjects) {
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left side - Calendar */}
      <Card className="col-span-1 md:col-span-2 glass-card hover-glow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            {format(month, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            onMonthChange={setMonth}
            className="rounded-md border"
            components={{
              DayContent
            }}
            modifiers={{
              hasTasks: (date) => {
                const dateStr = date.toISOString().split('T')[0];
                return taskCountByDate[dateStr] > 0;
              },
              selected: (date) => isSameISTDay(date, selectedDate)
            }}
            modifiersStyles={{
              hasTasks: {
                fontWeight: 'bold',
                color: 'var(--primary)'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Right side - Tasks for selected date and upcoming tasks */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        {/* Selected date tasks */}
        <Card className="glass-card hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                {isToday(selectedDate) && (
                  <Badge className="ml-2 bg-primary">Today</Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {sortedTasksForDate.length} {sortedTasksForDate.length === 1 ? 'task' : 'tasks'} scheduled
              </p>
            </div>
            {view === 'day' && (
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextDay}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {sortedTasksForDate.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <ListTodo className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Tasks for {format(selectedDate, 'MMM d')}</h3>
                </div>
                <TaskList tasks={sortedTasksForDate} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="icon-container mb-4 bg-muted/30">
                  <ListTodo className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No tasks scheduled</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no tasks scheduled for this date
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming tasks */}
        <Card className="glass-card hover-glow">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tasks due in the next 7 days
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {upcomingTasks.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{task.title}</h4>
                          {task.completed && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <CalendarClock className="h-4 w-4" />
                          <span>{format(new Date(task.dueDate!), 'MMM d, h:mm a')}</span>
                          {task.priorityLevel === 'high' && (
                            <Badge variant="destructive" className="ml-2">
                              High Priority
                            </Badge>
                          )}
                        </div>
                        {task.projectId && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Project: {projects.find(p => p.id === task.projectId)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) :
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="icon-container mb-4 bg-muted/30">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No upcoming tasks</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have no tasks due in the next 7 days
                  </p>
                </div>
              }
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
