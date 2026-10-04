"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  const [clock, period] = time.split(" ");

  return (
    <div className="flex items-baseline justify-center text-white">
      <span className="text-[76px] font-light leading-none tracking-[-0.07em] md:text-[86px]">
        {clock || "09:18"}
      </span>

      <span className="ml-3 text-[24px] font-light tracking-[-0.03em]">
        {period || "PM"}
      </span>
    </div>
  );
}
