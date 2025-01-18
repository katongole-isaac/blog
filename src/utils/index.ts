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
export const copyToClipboard = async (text: string, cb?: () => void) => {
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
 * Formats the display order for blog posts
 */

export const displayOrderForBlogs = <T>(items: T[], options: DisplayOptions = {}) => {
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
