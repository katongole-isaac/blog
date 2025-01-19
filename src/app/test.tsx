import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
import updateLocale from "dayjs/plugin/updateLocale"; // ES 2015
import calendar from "dayjs/plugin/calendar"; // ES 2015

export default function Test() {
  const time = 1736351467027.7205;
  const res = blogTimeFormat(time);

  const date = dayjs().subtract(30, "days");
  // console.log(date.);
  console.log("===>", blogTimeFormat(date.unix() * 1_000));

  return (
    <div className="dark:bg-neutral-800 py-3 px-5 border dark:border-neutral-700 min-w-max w-max max-w-96 rounded-md shadow-sm ">
      Lorem ipsum dolor sit a
    </div>
  );
}

/**
 * 
 */
const blogTimeFormat = (time: number) => {
  
  const blogCreationTime = dayjs(time);

  dayjs.extend(calendar);
  dayjs.extend(updateLocale);
  dayjs.extend(relativeTime);

  dayjs.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
    calendar: {
      lastDay: "[Yesterday]",
      sameDay: "[Today at] h:mm A",
      lastWeek: "[Last] dddd [at] h:mm A",
      sameElse: "MMMM D, YYYY",
    },
  });

  // If the blog creation Time is lessthan 66 hours use
  // relativeTime format otherwise use calender format

  const hoursToSwitchDisplayDateFormats = 36;

  const diffInHours = dayjs().diff(blogCreationTime, "hours");

  // calendar format
  if (diffInHours >= hoursToSwitchDisplayDateFormats) return dayjs(time).calendar(dayjs());

  // use relativeTime
  return dayjs(time).fromNow();
};
