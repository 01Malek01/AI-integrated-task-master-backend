import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
  category?: string;
}

const noteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category  : {
      type: String,
      default : "General"
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;
