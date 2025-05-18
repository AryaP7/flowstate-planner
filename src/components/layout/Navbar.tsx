import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Filter, 
  LayoutGrid,
  Search as SearchIcon,
  Bell as BellIcon,
  Plus as PlusIcon,
  Filter as FilterIcon,
  LayoutGrid as LayoutGridIcon,
  Menu,
  Settings,
  User,
  LogOut,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/context/AppContext';
import { PriorityLevel } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Calendar } from '@/components/ui/calendar';
import { useTasks } from '@/hooks/useTasks';
import { useTags } from '@/hooks/useTags';

export function Navbar() {
  const { projects, taskTags, currentUser, setState, tasks } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  // Filter state
  const [taskFilter, setTaskFilter] = useState<'all'|'completed'|'due'|'priority-asc'|'priority-desc'|'today'|'next7'|'month'>('all');
  // Search state
  const [search, setSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  // Only search by title
  const searchResults = search.trim()
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const { createTask } = useTasks();
  const { tags: tagsFromHooks, createTag } = useTags();
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');

  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/tasks':
        return 'Tasks';
      case '/projects':
        return 'Projects';
      case '/calendar':
        return 'Calendar';
      default:
        return 'Productivity Planner';
    }
  };
  
  const handleAddTask = () => {
    if (!taskTitle.trim() || !dueDate) return;
    const minDate = new Date('2025-05-10');
    const finalDueDate = dueDate < minDate ? minDate : dueDate;
    const taskData: any = {
      title: taskTitle,
      description: taskDescription,
      completed: false,
      userId: currentUser?.id || 'user-1',
      priorityLevel: priority,
      dueDate: finalDueDate,
      tags: selectedTag ? [selectedTag] : []
    };
    if (projectId) taskData.projectId = projectId;
    console.log('Creating task with data:', taskData);
    createTask(taskData, {
      onError: (error: any) => {
        console.error('Error creating task:', error.response?.data);
      }
    });
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setProjectId('');
    setPriority('medium');
    setDueDate(null);
    setSelectedTag('');
    setIsDialogOpen(false);
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    createTag({ name: newTagName, color: newTagColor });
    setNewTagName('');
    setNewTagColor('#3B82F6');
    setIsTagDialogOpen(false);
  };

  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-6 z-[10000] relative">
      <div className="flex items-center space-x-2">
        <LayoutGridIcon className="h-6 w-6 mr-3 text-primary" />
        <h1 className="text-2xl font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 h-10 bg-secondary text-base"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
          />
          {showSearchResults && search.trim() && (
            <div
              className="absolute left-0 mt-1 w-full bg-card border rounded shadow-lg z-[9999] max-h-64 overflow-y-auto pointer-events-auto"
            >
              {searchResults.length > 0 ? (
                searchResults.map(task => (
                  <div
                    key={task.id}
                    className="px-4 py-2 hover:bg-secondary cursor-pointer flex flex-col"
                    onMouseDown={() => {
                      navigate('/tasks');
                      setSearch('');
                      setShowSearchResults(false);
                      // Optionally: highlight task in tasks page (requires extra logic)
                    }}
                  >
                    <span className="font-medium">{task.title}</span>
                    <span className="text-xs text-muted-foreground truncate">{task.description}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-muted-foreground text-sm">No tasks found.</div>
              )}
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 bg-secondary hover:bg-secondary/80"
            >
              <FilterIcon className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTaskFilter('all')}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('completed')}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('due')}>Due (Overdue)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('priority-asc')}>Priority ↑</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('priority-desc')}>Priority ↓</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('today')}>Today</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('next7')}>Next 7 Days</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTaskFilter('month')}>This Month</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 bg-secondary hover:bg-secondary/80"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <select
                  id="project"
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="w-full p-2 rounded border bg-background text-foreground"
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={v => setPriority(v as PriorityLevel)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Calendar selected={dueDate} onSelect={setDueDate} mode="single" className="rounded-md border" />
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tagsFromHooks.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      className={`px-2 py-1 rounded-full border text-xs ${selectedTag === tag.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      style={{ borderColor: tag.color, color: selectedTag === tag.id ? '#fff' : tag.color }}
                      onClick={() => setSelectedTag(selectedTag === tag.id ? '' : tag.id)}
                    >
                      {tag.name}
                    </button>
                  ))}
                  <Button key="create-tag-btn" size="sm" variant="outline" className="ml-2" onClick={() => setIsTagDialogOpen(true)}>
                    + Create Tag
                  </Button>
                </div>
              </div>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tagName">Tag Name</Label>
                <Input id="tagName" value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="Enter tag name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagColor">Tag Color</Label>
                <Input id="tagColor" type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateTag}>Create Tag</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <ThemeToggle />
      </div>
    </div>
  );
}
