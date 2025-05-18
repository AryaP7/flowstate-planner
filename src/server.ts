import express, { Request, Response, NextFunction, Router } from 'express';
import { connectToDatabase } from './lib/mongodb';
import User from './models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Task from './models/Task';
import Project from './models/Project';
import Tag from './models/Tag';
import PriorityLevel from './models/PriorityLevel';
import { auth, generateToken } from './middleware/auth';
import cors from 'cors';

const app = express();
const router = Router();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));
app.options('*', cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

// Example health check route
router.get('/health', ((_req: Request, res: Response) => {
  res.json({ status: 'ok' });
}) as any);

// Test MongoDB connection route
router.get('/dbtest', (async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await connectToDatabase();
    res.json({ status: 'success', message: 'Connected to MongoDB!' });
  } catch (err: any) {
    next(err);
  }
}) as any);

// Error handling middleware
router.use(((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
}) as any);

// Mount the router
app.use('/api', router);

// Connect to MongoDB
connectToDatabase();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test database connection
app.get('/api/dbtest', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Auth routes
app.post('/api/auth/signup', (async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
}) as any);

app.post('/api/auth/signin', (async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id.toString());
    
    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token
    };
    
    res.json(userResponse);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Error signing in' });
  }
}) as any);

// Protected routes
app.use('/api/tasks', auth);
app.use('/api/projects', auth);
app.use('/api/tags', auth);
app.use('/api/analytics', auth);

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const { projectId, completed, priority, dueDate } = req.query;
    const query: any = { userId: req.user._id };
    
    if (projectId) query.projectId = projectId;
    if (completed !== undefined) query.completed = completed === 'true';
    if (priority) query.priorityLevel = priority;
    if (dueDate) {
      const date = new Date(dueDate as string);
      query.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      };
    }
    
    const tasks = await Task.find(query)
      .populate('projectId', 'name')
      .populate('tags', 'name color')
      .sort({ dueDate: 1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, completed, projectId, priorityLevel, dueDate, tags } = req.body;
    
    const task = new Task({
      title,
      description,
      completed,
      projectId,
      userId: req.user._id,
      priorityLevel,
      dueDate,
      tags
    });
    
    await task.save();
    
    // Add the task to the project's tasks array if projectId is present
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    }
    const populatedTask = await Task.findById(task._id)
      .populate('projectId', 'name')
      .populate('tags', 'name color');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Error creating task', details: error.message, stack: error.stack });
  }
});

app.put('/api/tasks/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    // Ensure user owns the task
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      update,
      { new: true }
    ).populate('projectId', 'name')
     .populate('tags', 'name color');
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
}) as any);

app.delete('/api/tasks/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user owns the task
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await Task.findByIdAndDelete(id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
}) as any);

app.patch('/api/tasks/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally, allow toggling complete/incomplete
    const task = await Task.findOne({ _id: id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    const updatedTask = await Task.findById(id)
      .populate('projectId', 'name')
      .populate('tags', 'name color');
    res.json(updatedTask);
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'Error completing task' });
  }
});

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .populate('tasks')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const project = new Project({
      name,
      description,
      userId: req.user._id
    });
    
    await project.save();
    
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

app.put('/api/projects/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    // Ensure user owns the project
    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
}) as any);

app.delete('/api/projects/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user owns the project
    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: id });
    
    await Project.findByIdAndDelete(id);
    
    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
}) as any);

// Tag routes
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.find({ userId: req.user._id })
      .sort({ name: 1 });
    
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Error fetching tags' });
  }
});

app.post('/api/tags', async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const tag = new Tag({
      name,
      color,
      userId: req.user._id
    });
    
    await tag.save();
    
    res.status(201).json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Error creating tag' });
  }
});

app.put('/api/tags/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    // Ensure user owns the tag
    const tag = await Tag.findOne({ _id: id, userId: req.user._id });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    const updatedTag = await Tag.findByIdAndUpdate(
      id,
      update,
      { new: true }
    );
    
    res.json(updatedTag);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Error updating tag' });
  }
}) as any);

app.delete('/api/tags/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure user owns the tag
    const tag = await Tag.findOne({ _id: id, userId: req.user._id });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    // Remove tag from all tasks
    await Task.updateMany(
      { tags: id },
      { $pull: { tags: id } }
    );
    
    await Tag.findByIdAndDelete(id);
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Error deleting tag' });
  }
}) as any);

// Analytics routes
app.get('/api/analytics/tasks', async (req, res) => {
  try {
    const query = { userId: req.user._id };
    
    const totalTasks = await Task.countDocuments(query);
    const completedTasks = await Task.countDocuments({ ...query, completed: true });
    const highPriorityTasks = await Task.countDocuments({ ...query, priorityLevel: 'high', completed: false });
    
    // Get tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tasksDueToday = await Task.countDocuments({
      ...query,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      },
      completed: false
    });
    
    // Get completion rate by priority
    const priorityStats = await Task.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$priorityLevel',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      totalTasks,
      completedTasks,
      highPriorityTasks,
      tasksDueToday,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      priorityStats
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
});

app.get('/api/analytics/projects', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).populate('tasks');
    
    const projectStats = projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((task: any) => task.completed).length;
      
      return {
        id: project._id,
        name: project.name,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
      };
    });
    
    res.json(projectStats);
  } catch (error) {
    console.error('Get project analytics error:', error);
    res.status(500).json({ error: 'Error fetching project analytics' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;