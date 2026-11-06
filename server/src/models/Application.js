import mongoose from "mongoose";

export const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
export const PRIORITIES = ["High", "Medium", "Low"];

const applicationSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: STATUSES, default: "Saved" },
    priority: { type: String, enum: PRIORITIES, default: "Medium" },
    dateApplied: { type: Date, default: null },
    followUpDate: { type: Date, default: null },
    location: { type: String, trim: true, default: "" },
    salary: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "" },
    jobLink: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
