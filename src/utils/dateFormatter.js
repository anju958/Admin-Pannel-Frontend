export function formatDate(dateStr, type = "table") {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  if (type === "form") {
    
    return date.toISOString().split("T")[0];
  }


  return date.toLocaleDateString("en-GB"); 
}