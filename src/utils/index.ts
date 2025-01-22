import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ES 2015
import updateLocale from "dayjs/plugin/updateLocale"; // ES 2015
import calendar from "dayjs/plugin/calendar"; // ES 2015

/**
 * Formats Time
 * @param time - Time in milliseconds
 * @returns Formatted string for the `time` passed
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

const fallbackCopyTextToClipboard = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // Prevent scrolling to the bottom of the page
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
    return true;
  } catch (err) {
    console.error("Fallback: Failed to copy text", err);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
};

/**
 * Copies text to clipboard otherwise it runs a fallback function to copy text
 * @param text - Text to copy to clipboard
 * @param cb - Callback to execute on success
 * @returns Void
 */
const copyToClipboard = async (text: string, cb?: () => void) => {
  let success = true;
  try {
    if (navigator.clipboard && "writeText" in navigator.clipboard) await window.navigator.clipboard.writeText(text);
    else success = fallbackCopyTextToClipboard(text);
  } catch (err) {
    success = false;
    console.error(" Failed to copy text", err);
  } finally {
    if (!success) return;
    if (cb) cb();
  }
};

interface DisplayOptions {
  /**
   * If enable, doubles sub array of the same length
   * @default false
   */
  doubleSubArrays?: boolean;
  /**
   * Array size limit of the sub arrays
   */
  arrayUplimit?: number;
  /**
   * Number of blog posts to display on a page. Defaults to `11`
   */
  limit?: number;
}

/**
 * Formats the display order for blog posts.  The format - `[[1], [2,3], [4,5,6]]`
 * You can tweak the `output` based on the options given
 */

const displayOrderForBlogs = <T>(items: T[], options: DisplayOptions = {}) => {
  if (items.length <= 2) return [items];

  const { limit = items.length, doubleSubArrays = false, arrayUplimit: arrUplimit = 3 } = options;

  const results: T[][] = [];

  const _items = items.slice(0, limit); // we can use the sliced array because it has the desired limit]
  let _doubleSubArraysOccurenceLimit = 4; // used when the doubleSubArrays is true

  let _arrUplimit = arrUplimit;
  // we increase the arrUplimit by 1 because we have to substract by 1
  // when checking the last sub array size
  // And remember arrays are zero indexed
  _arrUplimit++;

  let subArrayItemLimit = 1;

  for (let i = 0; i < _items.length; i++) {
    if (i === 0) {
      results.push([_items[i]]);
      subArrayItemLimit++;
      continue;
    }

    const lastSubArr = results[results.length - 1];

    // check whether the previous subArray is full
    if (lastSubArr.length === subArrayItemLimit - 1) {
      if (!doubleSubArrays) results.push([_items[i]]);
      if (subArrayItemLimit === _arrUplimit) {
        // do nothing only if doubSubArray is false
        if (doubleSubArrays) {
          if (lastSubArr.length === results[results.length - 2].length) {
            results.push([_items[i]]);
            continue;
          }
          results.push([_items[i]]);
        }
      } else {
        if (doubleSubArrays) {
          // Fix double
          if (results.length === 1) {
            subArrayItemLimit++;
            results.push([_items[i]]);
            continue;
          }

          const arrayLengthDuplicates = 2; // for the sub array length to be duplicated, sub arrays
          let duplicates = 0; // we need at least two items with the same size as the lastSubArr
          for (let res of results.values()) {
            if (res.length === lastSubArr.length) ++duplicates;
            if (duplicates === arrayLengthDuplicates) break;
          }

          if (duplicates === arrayLengthDuplicates - 1) {
            results.push([_items[i]]);
            continue;
          }

          if (lastSubArr.length === results[results.length - 2].length) {
            results.push([_items[i]]);
            subArrayItemLimit++;
          }
        } else subArrayItemLimit++;
      }
    } else lastSubArr.push(_items[i]);
  }

  return results;
};

export default {
  blogTimeFormat,
  displayOrderForBlogs,
  copyToClipboard,
};
