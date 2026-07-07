export function resolveImageUrl(url: string | undefined): string {
  if (!url) return "";
  
  // If it starts with /uploads/ or uploads/, return exactly that relative URL
  if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
    return url.startsWith("/") ? url : `/${url}`;
  }
  
  // If it is a base64 string, return it directly
  if (url.startsWith("data:")) {
    return url;
  }
  
  // If the path contains "/src/assets/", map it to "/assets/" so Vite can serve it
  if (url.includes("/src/assets/")) {
    return url.replace("/src/assets/", "/assets/");
  }
  if (url.includes("src/assets/")) {
    return url.replace("src/assets/", "/assets/");
  }
  
  // Default relative path
  return url;
}
