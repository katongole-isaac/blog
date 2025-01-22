import { useEffect, useState } from "react";
import utils from "@/utils";
import dayjs from "dayjs";

/**
 * Hook or wrapper around `blogTimeFormat`
 * @param time Time in milliseconds
 * @returns {string} Formatted string for the `time` passed
 * @see {@link /src/utils/blogTimeFormat} for implementation
 *
 */
export default function (time: number) {
  const [formatted, setFormatted] = useState(utils.blogTimeFormat(time));

  let timerID: NodeJS.Timeout;

  const passedDays = dayjs().diff(dayjs(time), "days");

  /**
   * These are number of days we perform the time updates.(updating the UI)
   * Otherwise the time/date shown on a blog will be computed upon refetching the blog
   */
  const runForAMonth = 31; // days

  useEffect(() => {
    if (passedDays > runForAMonth) return;
    timerID = setInterval(() => {
      setFormatted(utils.blogTimeFormat(time));
    }, 1_000);

    return () => {
      timerID && clearInterval(timerID);
    };
  }, [time]);

  return { formattedTime: formatted };
}
