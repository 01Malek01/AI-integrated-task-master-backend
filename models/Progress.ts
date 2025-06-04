import mongoose, { Document, Schema } from "mongoose";

export interface IProgress extends Document {
  userId: string;
  tasksCompleted: number;
  notesCreated: number;
}

const progressSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  notesCreated: {
    type: Number,
    default: 0,
  },
});

const Progress = mongoose.model<IProgress>("Progress", progressSchema);

export default Progress;
