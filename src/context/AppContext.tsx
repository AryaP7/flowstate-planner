import { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, User } from '../types';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useTags } from '@/hooks/useTags';
import { useAnalytics } from '@/hooks/useAnalytics';

// Initial state
const initialState: AppState = {
  currentUser: null,
  projects: [],
  tasks: [],
  tags: [],
  taskTags: [],
  projectStats: [],
};

interface AppContextType extends AppState {
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  // Task methods
  tasks: any[];
  createTask: (...args: any[]) => any;
  updateTask: (...args: any[]) => any;
  deleteTask: (...args: any[]) => any;
  completeTask: (...args: any[]) => any;
  // Project methods
  projects: any[];
  createProject: (...args: any[]) => any;
  updateProject: (...args: any[]) => any;
  deleteProject: (...args: any[]) => any;
  // Tag methods
  tags: any[];
  createTag: (...args: any[]) => any;
  updateTag: (...args: any[]) => any;
  deleteTag: (...args: any[]) => any;
  // Analytics
  projectStats: any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Remove useAuth usage
  // const { signin, signup, signout } = useAuth();
  const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();
  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const { tags, createTag, updateTag, deleteTag } = useTags();
  const { projectStats } = useAnalytics();

  console.log(tags);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setState,
        // Remove Auth methods from context value
        // signin,
        // signup,
        // signout,
        // Task methods
        tasks,
        createTask,
        updateTask,
        deleteTask,
        completeTask,
        // Project methods
        projects,
        createProject,
        updateProject,
        deleteProject,
        // Tag methods
        tags,
        createTag,
        updateTag,
        deleteTag,
        // Analytics
        projectStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
