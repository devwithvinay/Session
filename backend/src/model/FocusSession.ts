import mongoose from "mongoose";

export interface IFocusSession {
  user: mongoose.Types.ObjectId;

  startTime: Date;
  activeStartTime: Date;

  pausedAt?: Date;
  endTime?: Date;

  mode: "focus" | "short" | "long";

  targetDuration: number;

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

    activeStartTime: {
      type: Date,
      required: true,
    },

    pausedAt: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    mode: {
      type: String,
      enum: ["focus", "short", "long"],
      default: "focus",
      required: true,
    },

    targetDuration: {
      type: Number,
      required: true,
      min: 5 * 60,
      max: 120 * 60,
    },

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
