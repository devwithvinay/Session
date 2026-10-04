import mongoose from "mongoose";

export interface IFocusSession {
  user: mongoose.Types.ObjectId;

  startTime: Date;

  activeStartTime: Date;

  pausedAt?: Date;

  endTime?: Date;

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

    // When the current active focus period started
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

const FocusSession = mongoose.model<IFocusSession>(
  "FocusSession",
  focusSessionSchema,
);

export default FocusSession;
