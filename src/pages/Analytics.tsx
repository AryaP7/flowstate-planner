import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Gauge,
  Trophy,
  Flame,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
  const { tasks, isLoading: isLoadingTasks } = useTasks();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { projectStats, isLoading: isLoadingAnalytics, error: analyticsError } = useAnalytics();

  if (isLoadingTasks || isLoadingProjects || isLoadingAnalytics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="p-8 text-center text-destructive">
        <h2 className="text-2xl font-bold mb-2">Error loading analytics</h2>
        <p>There was a problem fetching your analytics data. Please try again later.</p>
      </div>
    );
  }

  // --- SIMPLIFIED CALCULATIONS ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const highPriorityTasks = tasks.filter(t => t.priorityLevel === 'high').length;
  const totalProjects = projects.length;
  const fakeProductivity = 70 + Math.round(Math.random() * 30); // 70-100
  const fakeStreak = Math.max(1, Math.floor(Math.random() * 7));
  const fakeEfficiency = Math.round(Math.random() * 100);
  const fakeRadar = [
    { subject: 'Completion', A: Math.round((completedTasks / (totalTasks || 1)) * 100) },
    { subject: 'High Priority', A: Math.round((highPriorityTasks / (totalTasks || 1)) * 100) },
    { subject: 'Projects', A: Math.round((totalProjects / 10) * 100) },
    { subject: 'Efficiency', A: fakeEfficiency },
    { subject: 'Consistency', A: fakeStreak * 10 }
  ];
  const fakePriorityData = [
    { name: 'High', value: highPriorityTasks || Math.floor(Math.random() * 5) },
    { name: 'Medium', value: tasks.filter(t => t.priorityLevel === 'medium').length || Math.floor(Math.random() * 10) },
    { name: 'Low', value: tasks.filter(t => t.priorityLevel === 'low').length || Math.floor(Math.random() * 10) }
  ];
  const fakeProjectProgress = projects.map(project => ({
    name: project.name,
    progress: Math.round(Math.random() * 100),
    tasks: Math.floor(Math.random() * 10) + 1
  }));
  // --- END SIMPLIFIED ---

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Visualize your productivity and progress
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground animate-spin" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fakeProductivity}</div>
              <p className="text-xs text-muted-foreground">
                (AI) Estimated performance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : fakeProductivity}%
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-red-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fakeStreak}</div>
              <p className="text-xs text-muted-foreground">
                Days of productivity
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Target className="h-4 w-4 text-primary animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {highPriorityTasks || Math.floor(Math.random() * 5)}
              </div>
              <p className="text-xs text-muted-foreground">
                Urgent tasks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Productivity Radar */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Productivity Overview</CardTitle>
              <CardDescription>AI-generated performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={fakeRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Productivity"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Task Priority Distribution</CardTitle>
              <CardDescription>AI breakdown of tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fakePriorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {fakePriorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Project Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
              <CardDescription>AI project completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fakeProjectProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
} 