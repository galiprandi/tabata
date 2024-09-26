// Format duration in seconds to human readable format
export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes ? `${minutes}m` : ""}${
    remainingSeconds ? `${remainingSeconds}s` : ""
  }`;
};

// Change container class function
export const switchBodyClass = (className: string) => {
  const container = document.body;
  if (!container) return;
  container.className = `${className}`;
};

// Get classes from element
export const getClasses = (element: HTMLElement) =>
  Array.from(element.classList);

// Get classes from body
export const getBodyClasses = () => getClasses(document.body);

// Return true if element has class
export const hasClass = (element: HTMLElement, className: string) =>
  element.classList.contains(className);

export const onClick = (selector: string, callback: (e: Event) => void) =>
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", callback);
  });
