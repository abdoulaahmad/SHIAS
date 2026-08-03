export function format(date: string | number | Date, formatString: string): string {
  const d = new Date(date);
  
  if (formatString === "MMM d, yyyy") {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  }
  
  if (formatString === "MMM dd, yyyy h:mm a") {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit" }).format(d);
  }
  
  // Default fallback
  return d.toLocaleDateString();
}
