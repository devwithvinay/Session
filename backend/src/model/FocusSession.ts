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

  // Total actual duration in seconds
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
      min: 5 * 60,
      max: 120 * 60,
    },

    // Total actual duration in seconds
    duration: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
      max: 120 * 60,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed", "cancelled"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Session history
focusSessionSchema.index({
  user: 1,
  startTime: -1,
});

// Find active/paused sessions
focusSessionSchema.index({
  user: 1,
  status: 1,
});

// Analytics queries
focusSessionSchema.index({
  user: 1,
  mode: 1,
  status: 1,
});

/*
 * IMPORTANT:
 *
 * A user can have only ONE active/paused session.
 *
 * This database-level constraint protects against
 * concurrent requests creating multiple active sessions.
 */
focusSessionSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: ["active", "paused"],
      },
    },
  },
);

const FocusSession = mongoose.model<IFocusSession>(
  "FocusSession",
  focusSessionSchema,
);

export default FocusSession;
