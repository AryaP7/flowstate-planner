// Define our core entity types based on 3NF principles

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  userId: string; // Foreign key to User
  lastAccessed?: Date;
  tasks?: any[]; // Optional: populated from backend, can be ObjectId[] or Task[]
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string; // Foreign key to User
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  createdAt: Date;
  projectId: string; // Foreign key to Project
  userId: string; // Foreign key to User
  priorityLevel: PriorityLevel;
  lastAccessed?: Date;
}

// Junction table for many-to-many relationship between Task and Tag
export interface TaskTag {
  taskId: string; // Foreign key to Task
  tagId: string; // Foreign key to Tag
}

export interface ProjectStats {
  id: string;
  name: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

// App context state type
export interface AppState {
  currentUser: User | null;
  projects: Project[];
  tasks: Task[];
  tags: Tag[];
  taskTags: TaskTag[];
  projectStats: ProjectStats[];
}

export interface AppContextType extends AppState {
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  // Auth methods
  signin: (data: { email: string; password: string }) => void;
  signup: (data: { name: string; email: string; password: string }) => void;
  signout: () => void;
  // Task methods
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (data: { id: string; data: Partial<Task> }) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  // Project methods
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'userId'>) => void;
  updateProject: (data: { id: string; data: Partial<Project> }) => void;
  deleteProject: (id: string) => void;
  // Tag methods
  createTag: (data: Omit<Tag, 'id' | 'userId'>) => void;
  updateTag: (data: { id: string; data: Partial<Tag> }) => void;
  deleteTag: (id: string) => void;
}
