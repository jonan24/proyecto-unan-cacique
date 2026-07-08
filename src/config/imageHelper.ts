export function resolveImageUrl(url: string | undefined): string {
  if (!url) return "";
  
  // If it is a base64 string, return it directly
  if (url.startsWith("data:")) {
    return url;
  }

  let processed = url.trim();

  // Handle src/assets mapping or duplicate src/assets parts
  if (processed.includes("/src/assets/")) {
    processed = processed.replace("/src/assets/", "/assets/");
  } else if (processed.includes("src/assets/")) {
    processed = processed.replace("src/assets/", "/assets/");
  }

  // Handle uploads folder mapping
  if (processed.startsWith("/uploads/") || processed.startsWith("uploads/")) {
    return processed.startsWith("/") ? processed : `/${processed}`;
  }

  // Ensure leading slash for relative assets paths
  if (processed.startsWith("assets/")) {
    return `/${processed}`;
  }

  // Return processed string, guaranteeing relative root starts with a slash if not an absolute protocol
  if (processed.startsWith("/") || processed.includes("://")) {
    return processed;
  }

  return `/${processed}`;
}
