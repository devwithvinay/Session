
import mongoose from "mongoose";

export interface IFocusSession {
  user: mongoose.Types.ObjectId;
  startTime: Date;
  activeStartTime: Date;
  pausedAt?: Date;
  endTime?: Date;

  // focus | short break | long break
  mode: "focus" | "short" | "long";

  // Planned duration in seconds
  targetDuration: number;

  // Total actual focus time in seconds
  duration: number;

  status: "active" | "paused" | "completed" | "cancelled";
}

const focusSessionSchema = new mongoose.Schema<IFocusSession>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    // When the current active period started
    activeStartTime: {
      type: Date,
      required: true,
    },

    // Set only while paused
    pausedAt: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    // Session type
    mode: {
      type: String,
      enum: ["focus", "short", "long"],
      default: "focus",
      required: true,
    },

    // Planned duration in seconds
    targetDuration: {
      type: Number,
      required: true,
    },

    // Total actual focused seconds
    duration: {
      type: Number,
      default: 0,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

focusSessionSchema.index({
  user: 1,
  startTime: -1,
});

focusSessionSchema.index({
  user: 1,
  status: 1,
});

focusSessionSchema.index({
  user: 1,
  mode: 1,
  status: 1,
});

const FocusSession = mongoose.model<IFocusSession>(
  "FocusSession",
  focusSessionSchema,
);

export default FocusSession;

