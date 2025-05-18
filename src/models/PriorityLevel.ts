import mongoose, { Schema, Document } from 'mongoose';

export interface IPriorityLevel extends Document {
  name: string;
  value: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const PriorityLevelSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    unique: true
  },
  value: {
    type: Number,
    required: true,
    enum: [1, 2, 3] // 1: low, 2: medium, 3: high
  },
  color: {
    type: String,
    required: true,
    default: '#808080' // Default gray color
  }
}, {
  timestamps: true
});

// Create default priority levels if they don't exist
PriorityLevelSchema.statics.initializeDefaults = async function() {
  const defaults = [
    { name: 'low', value: 1, color: '#4CAF50' },    // Green
    { name: 'medium', value: 2, color: '#FFC107' }, // Yellow
    { name: 'high', value: 3, color: '#F44336' }    // Red
  ];

  for (const priority of defaults) {
    await this.findOneAndUpdate(
      { name: priority.name },
      priority,
      { upsert: true, new: true }
    );
  }
};

export default mongoose.model<IPriorityLevel>('PriorityLevel', PriorityLevelSchema); 