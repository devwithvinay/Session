import type { NextFunction, Request, Response } from "express";
import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

/* =========================================================
   MAIL TRANSPORTER
========================================================= */

const createMailTransporter = () => {
  const host = process.env.MAILTRAP_HOST;
  const port = process.env.MAILTRAP_PORT;
  const user = process.env.MAILTRAP_USER;
  const pass = process.env.MAILTRAP_PASS;

  if (!host || !port || !user || !pass) {
    throw new AppError("Email service is not configured.", 500);
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: false,
    auth: {
      user,
      pass,
    },
  });
};

/* =========================================================
   REGISTER
========================================================= */

export const registerUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new AppError("All fields are required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new AppError("User already exists.", 409);
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      verificationToken,
      tokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
    });

    if (!user) {
      throw new AppError("Failed to register user.", 500);
    }

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new AppError("Backend URL is not configured.", 500);
    }

    const verificationUrl = `${backendUrl}/api/v1/users/verify/${verificationToken}`;

    const transporter = createMailTransporter();

    const senderEmail = process.env.MAILTRAP_SENDERMAIL;

    if (!senderEmail) {
      throw new AppError("Email sender is not configured.", 500);
    }

    const mailOptions = {
      from: senderEmail,
      to: user.email,
      subject: "Please verify your email",
      text: `Please verify your email by clicking this link:

${verificationUrl}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
          <h2>Verify your email</h2>

          <p>Thanks for creating your Session account.</p>

          <p>
            Please click the button below to verify your email address:
          </p>

          <a
            href="${verificationUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #111827;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Verify Email
          </a>

          <p style="margin-top: 20px; color: #666;">
            This verification link expires in 15 minutes.
          </p>

          <p style="color: #666; word-break: break-all;">
            ${verificationUrl}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "User registered successfully.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   VERIFY USER
========================================================= */

export const verifyUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.params;

    if (!token) {
      throw new AppError("Invalid verification token.", 400);
    }

    const user = await User.findOne({
      verificationToken: token,
      tokenExpiry: {
        $gt: new Date(),
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification token.", 400);
    }

    user.isVerified = true;
    user.verificationToken = "";
    user.tokenExpiry = new Date(0);

    await user.save();

    return res.status(200).json({
      message: "User verification successful.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   LOGIN
========================================================= */

export const loginUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isVerified) {
      throw new AppError("Please verify your email before logging in.", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid email or password.", 401);
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is missing.");

      throw new AppError("Authentication service is not configured.", 500);
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      message: "Login successful.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET CURRENT USER
========================================================= */

export const getUser = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    return res.status(200).json({
      message: "User fetched successfully.",
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE USERNAME
========================================================= */

export const updateUsername = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required.", 400);
    }

    const normalizedUsername = username.trim();

    const user = await User.findById(req.user?.id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    user.username = normalizedUsername;

    await user.save();

    return res.status(200).json({
      message: "Username updated successfully.",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   LOGOUT
========================================================= */

export const logout = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export const forgotPassword = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    /*
      Do not reveal whether an email exists.
      This prevents user/email enumeration.
    */

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
        success: true,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const frontendUrl = process.env.BASE_URL;

    if (!frontendUrl) {
      throw new AppError("Frontend URL is not configured.", 500);
    }

    /*
      This should point to your frontend reset-password page.
      Adjust the path if your actual page has a different route.
    */

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const transporter = createMailTransporter();

    const senderEmail = process.env.MAILTRAP_SENDERMAIL;

    if (!senderEmail) {
      throw new AppError("Email sender is not configured.", 500);
    }

    const resetMailOptions = {
      from: senderEmail,
      to: user.email,
      subject: "Reset your Session password",
      text: `Click the following link to reset your password:

${resetUrl}

This link expires in 10 minutes.`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px;">
          <h2>Reset your password</h2>

          <p>
            We received a request to reset your Session password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #111827;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px; color: #666;">
            This link expires in 10 minutes.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(resetMailOptions);

    return res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetpassword = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { resetToken } = req.params;

    if (!resetToken) {
      throw new AppError("Invalid or expired reset token.", 400);
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token.", 400);
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      throw new AppError("Password and confirmation are required.", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match.", 400);
    }

    user.password = password;

    user.resetPasswordToken = "";

    user.resetTokenExpires = new Date(0);

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully.",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
