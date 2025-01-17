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
