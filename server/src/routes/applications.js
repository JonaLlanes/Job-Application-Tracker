import { Router } from "express";
import mongoose from "mongoose";
import Application, { PRIORITIES, STATUSES } from "../models/Application.js";

const router = Router();

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseDate(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "invalid";
  }

  return date;
}

function validate(body) {
  const company = text(body.company);
  const role = text(body.role);

  if (!company) {
    return { error: "Company is required" };
  }
  if (!role) {
    return { error: "Role is required" };
  }

  const status =
    body.status === undefined || body.status === null || body.status === ""
      ? "Saved"
      : body.status;
  const priority =
    body.priority === undefined || body.priority === null || body.priority === ""
      ? "Medium"
      : body.priority;

  if (!STATUSES.includes(status)) {
    return { error: "Invalid status" };
  }
  if (!PRIORITIES.includes(priority)) {
    return { error: "Invalid priority" };
  }

  const dateApplied = parseDate(body.dateApplied);
  if (dateApplied === "invalid") {
    return { error: "Invalid date applied" };
  }

  const followUpDate = parseDate(body.followUpDate);
  if (followUpDate === "invalid") {
    return { error: "Invalid follow-up date" };
  }

  return {
    data: {
      company,
      role,
      status,
      priority,
      dateApplied,
      followUpDate,
      location: text(body.location),
      salary: text(body.salary),
      source: text(body.source),
      jobLink: text(body.jobLink),
      notes: text(body.notes),
    },
  };
}

router.get("/", async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status !== undefined && status !== "") {
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    filter.status = status;
  }

  const applications = await Application.find(filter).sort({ createdAt: -1 });
  res.json(applications);
});

router.post("/", async (req, res) => {
  const { error, data } = validate(req.body ?? {});
  if (error) {
    return res.status(400).json({ message: error });
  }

  const application = await Application.create(data);
  res.status(201).json(application);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Application not found" });
  }

  const { error, data } = validate(req.body ?? {});
  if (error) {
    return res.status(400).json({ message: error });
  }

  const application = await Application.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json(application);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Application not found" });
  }

  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  res.json(application);
});

export default router;
