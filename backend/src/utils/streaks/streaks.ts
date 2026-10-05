import type { IFocusSession } from "../../model/FocusSession.js";

const TIMEZONE = "Asia/Kolkata";

const getDay = (date: Date) => {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: TIMEZONE,
  });
};

const getPreviousDay = (dateString: string) => {
  const parts = dateString.split("-");

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(Date.UTC(year, month - 1, day));

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
};

export const calculateStreaks = (sessions: IFocusSession[]) => {
  // Only completed sessions count.
  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  );

  // Get unique focus-session days in IST.
  const uniqueDays = [
    ...new Set(completedSessions.map((session) => getDay(session.startTime))),
  ].sort();

  if (uniqueDays.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  // Calculate current streak.
  const today = getDay(new Date());

  let currentStreak = 0;
  let expectedDay = today;

  for (let i = uniqueDays.length - 1; i >= 0; i--) {
    const currentDay = uniqueDays[i];

    if (currentDay === undefined) {
      continue;
    }

    if (currentDay === expectedDay) {
      currentStreak++;
      expectedDay = getPreviousDay(expectedDay);
    } else if (currentDay < expectedDay) {
      break;
    }
  }

  // Calculate best streak.
  let bestStreak = 1;
  let streak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const currentDay = uniqueDays[i];
    const previousDay = uniqueDays[i - 1];

    if (currentDay === undefined || previousDay === undefined) {
      continue;
    }

    const expectedPreviousDay = getPreviousDay(currentDay);

    if (expectedPreviousDay === previousDay) {
      streak++;
    } else {
      streak = 1;
    }

    bestStreak = Math.max(bestStreak, streak);
  }

  return {
    currentStreak,
    bestStreak,
  };
};
