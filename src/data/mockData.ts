import { User, Project, Task, Tag, TaskTag, PriorityLevel } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  createdAt: new Date('2023-01-15')
};

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    color: '#3B82F6', // blue
    createdAt: new Date('2023-05-10'),
    userId: 'user-1'
  },
  {
    id: 'proj-2',
    name: 'Marketing Campaign',
    description: 'Q3 product marketing campaign',
    color: '#8B5CF6', // purple
    createdAt: new Date('2023-06-22'),
    userId: 'user-1'
  },
  {
    id: 'proj-3',
    name: 'Product Launch',
    description: 'New feature launch preparations',
    color: '#EC4899', // pink
    createdAt: new Date('2023-07-05'),
    userId: 'user-1'
  }
];

export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Urgent', color: '#EF4444', userId: 'user-1' }, // red
  { id: 'tag-2', name: 'Development', color: '#3B82F6', userId: 'user-1' }, // blue
  { id: 'tag-3', name: 'Design', color: '#8B5CF6', userId: 'user-1' }, // purple
  { id: 'tag-4', name: 'Research', color: '#10B981', userId: 'user-1' }, // green
  { id: 'tag-5', name: 'Meeting', color: '#F59E0B', userId: 'user-1' } // amber
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Wireframe homepage design',
    description: 'Create wireframes for the new homepage layout',
    dueDate: new Date('2025-03-14'),
    completed: false,
    createdAt: new Date('2025-03-01'),
    projectId: 'proj-1',
    userId: 'user-1',
    priorityLevel: 'high' as PriorityLevel
  },
  {
    id: 'task-2',
    title: 'Research competitors',
    description: 'Analyze top 5 competitors for new feature ideas',
    dueDate: new Date('2025-03-10'),
    completed: true,
    createdAt: new Date('2025-02-25'),
    projectId: 'proj-2',
    userId: 'user-1',
    priorityLevel: 'medium' as PriorityLevel
  },
  {
    id: 'task-3',
    title: 'Write API documentation',
    description: 'Document all new API endpoints for developer portal',
    dueDate: new Date('2025-03-20'),
    completed: false,
    createdAt: new Date('2025-03-02'),
    projectId: 'proj-1',
    userId: 'user-1',
    priorityLevel: 'low' as PriorityLevel
  },
  {
    id: 'task-4',
    title: 'Create social media assets',
    description: 'Design graphics for Twitter, LinkedIn and Facebook',
    dueDate: new Date('2025-03-12'),
    completed: false,
    createdAt: new Date('2025-03-03'),
    projectId: 'proj-2',
    userId: 'user-1',
    priorityLevel: 'medium' as PriorityLevel
  },
  {
    id: 'task-5',
    title: 'Prepare launch presentation',
    description: 'Create slides for the product launch meeting',
    dueDate: new Date('2025-04-01'),
    completed: false,
    createdAt: new Date('2025-03-05'),
    projectId: 'proj-3',
    userId: 'user-1',
    priorityLevel: 'high' as PriorityLevel
  }
];

export const mockTaskTags: TaskTag[] = [
  { taskId: 'task-1', tagId: 'tag-3' }, // Design tag for wireframe task
  { taskId: 'task-2', tagId: 'tag-4' }, // Research tag for competitor analysis
  { taskId: 'task-3', tagId: 'tag-2' }, // Development tag for API docs
  { taskId: 'task-4', tagId: 'tag-3' }, // Design tag for social media assets
  { taskId: 'task-5', tagId: 'tag-5' }, // Meeting tag for presentation
  { taskId: 'task-1', tagId: 'tag-1' }, // Urgent tag for wireframe task
  { taskId: 'task-5', tagId: 'tag-1' }  // Urgent tag for presentation
];

export const getTagsForTask = (taskId: string): Tag[] => {
  const tagIds = mockTaskTags
    .filter(tt => tt.taskId === taskId)
    .map(tt => tt.tagId);
  
  return mockTags.filter(tag => tagIds.includes(tag.id));
};

export const getTasksForProject = (projectId: string): Task[] => {
  return mockTasks.filter(task => task.projectId === projectId);
};
