import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  userId: mongoose.Types.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
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
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;
