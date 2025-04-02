import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true},
  done: { type: Boolean, required: true},
}, {
  versionKey: false,
  timestamps: true,
});


const User = mongoose.model("Task", taskSchema);

export default User;