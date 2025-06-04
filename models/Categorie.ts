import mongoose, { Document, Schema } from "mongoose";

export interface ICategorie extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  isDefault?: boolean;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categoriesSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model<ICategorie>("Categories", categoriesSchema);
export default Categories;
