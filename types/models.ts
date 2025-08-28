import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  subscription?: Types.ObjectId;
  stripeCustomerId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isSubscribed: boolean;
  subscriptionType: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  settings : {  
    notifications : boolean;
    darkMode : boolean; 
  }
}

export interface ITask extends Document {
  subTasks :  {
    title: string;
    description: string;
    dueDate?: Date | null;
    priority?: 'low' | 'medium' | 'high';
    status?: 'todo' | 'in-progress' | 'completed';
  }[];
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  user: Types.ObjectId;
  category?: Types.ObjectId;
   startDate ?: Date;
}

export interface IProgress extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  progress: number; // 0-100
  notes?: string;
  date: Date;
}

export interface INote extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  name: string;
  user: Types.ObjectId;
  color?: string;
}
