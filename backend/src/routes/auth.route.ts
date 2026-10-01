import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  logout,
  registerUser,
  resetpassword,
  verifyUser,
} from "../controllers/auth.controller.js";
import { loggedIn } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/getme", loggedIn, getUser);
router.get("/logout", logout);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/resetpassword/:resetToken",
  validate(resetPasswordSchema),
  resetpassword,
);

export default router;
