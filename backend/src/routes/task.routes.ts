import { Router } from "express";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { loggedIn } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", loggedIn, createTask);
router.get("/", loggedIn, getTasks);
router.patch("/:id", loggedIn, updateTask);
router.delete("/:id", loggedIn, deleteTask);

export default router;
