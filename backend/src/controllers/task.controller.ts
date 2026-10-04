import type { Request, Response, NextFunction } from "express";
import Task from "../model/Task.model.js";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// ==============================
// CREATE TASK
// ==============================

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { title, description, priority, dueDate } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
        success: false,
      });
    }

const taskData: {
  user: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
} = {
  user: req.user.id,
  title: title.trim(),
  priority: priority || "medium",
};

if (description !== undefined) {
  taskData.description = description.trim();
}

if (dueDate !== undefined) {
  taskData.dueDate = new Date(dueDate);
}

const task = await Task.create(taskData);

    return res.status(201).json({
      message: "Task created successfully",
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL TASKS
// ==============================

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const tasks = await Task.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE TASK
// ==============================

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    const { title, description, completed, priority, dueDate } = req.body;

    const task = await Task.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    // Update title
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Task title cannot be empty",
          success: false,
        });
      }

      task.title = title.trim();
    }

    // Update description
    if (description !== undefined) {
      task.description = description.trim();
    }

    // Update completed status
    if (completed !== undefined) {
      task.completed = completed;
    }

    // Update priority
    if (priority !== undefined) {
      task.priority = priority;
    }

    // Update due date
    if (dueDate !== undefined) {
      task.dueDate = new Date(dueDate);
    }

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// DELETE TASK
// ==============================

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
