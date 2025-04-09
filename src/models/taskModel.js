import mongoose from "mongoose";
import { v4 } from "uuid";

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true},
  done: { type: Boolean, required: true},
  token: { type: String, unique: true, default: v4()},
}, {
  versionKey: false,
  timestamps: true,
});


const Task = mongoose.model("Task", taskSchema);

export default Task;