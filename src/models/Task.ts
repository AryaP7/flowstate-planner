import mongoose, { Schema, Document } from 'mongoose';
import { PriorityLevel } from '@/types';

export interface ITask extends Document {
  title: string;
  description: string;
  completed: boolean;
  projectId: mongoose.Types.ObjectId | null;
  userId: mongoose.Types.ObjectId;
  priorityLevel: PriorityLevel;
  dueDate: Date;
  tags: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priorityLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ projectId: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priorityLevel: 1 });

export default mongoose.model<ITask>('Task', TaskSchema); 