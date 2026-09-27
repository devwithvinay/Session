import type { IFocusSession } from "../../model/FocusSession.js";

const getDay = (date: Date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

export const calculateStreaks = (sessions: IFocusSession[]) => {
  // only complete session counts
  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  );

  // remove duplicate days
  const uniqueDays = [
    ...new Set(completedSessions.map((session) => getDay(session.startTime))),
  ].sort((a, b) => a - b);

  if (uniqueDays.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
    };
  }

  //calculate currentStreaks
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

      expectedDay -= 1000 * 60 * 60 * 24;
    } else if (currentDay < expectedDay) {
      break;
    }
  }

  // Calculate best Streak

  let bestStreak = 1;
  let streak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const currentDay = uniqueDays[i];
    const previousDay = uniqueDays[i - 1];

    if (currentDay === undefined || previousDay === undefined) {
      continue;
    }
    const difference = (currentDay - previousDay) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
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
