import posts from "./posts.js"

export default async function () {
  const allPosts = await posts()
  const tagMap = new Map() // Use Map to handle case-insensitive deduplication

  allPosts.forEach((post) => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        if (tag && typeof tag === "string") {
          const normalizedKey = tag.toLowerCase().trim().replace(/\s+/g, "-")
          // Store the first occurrence of each normalized tag (preserves original casing)
          if (!tagMap.has(normalizedKey)) {
            tagMap.set(normalizedKey, tag)
          }
        }
      })
    }
  })

  // Return array of unique tags (by normalized form, but with original casing)
  return Array.from(tagMap.values())
}
