export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Use UTC to ensure consistency between server and client
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", mergedOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
