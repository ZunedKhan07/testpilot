import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    geminiApiKey: {
      type: String,
      required: true,
      trim: true,
    },
    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    techMap: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);