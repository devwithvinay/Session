import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  username: string;
  email: string;
  password: string;

  isVerified: boolean;

  verificationToken?: string;
  tokenExpiry?: Date;

  resetPasswordToken?: string;
  resetTokenExpires?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      select: false,
    },

    tokenExpiry: {
      type: Date,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetTokenExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);



userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
