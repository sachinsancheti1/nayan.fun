export default {
  pagination: {
    data: "tagList",
    size: 1,
    alias: "tag",
  },
  permalink: ({ tag }) => `/tags/${tag.toLowerCase().trim().replace(/\s+/g, "-")}/`,
  eleventyComputed: {
    title: ({ tag }) => `Posts tagged "${tag}"`,
    posts: ({ tag, posts }) => {
      if (!posts || posts.length === 0) {
        console.warn("Global posts data is empty in tag.11tydata.js")
        return []
      }

      // Create a normalized version of the current tag for comparison
      const normalizedCurrentTag = tag.toLowerCase().trim().replace(/\s+/g, "-")

      // Filter posts that have tags matching the normalized form
      const matchingPosts = posts.filter((post) => {
        if (!post.tags || !Array.isArray(post.tags)) return false

        return post.tags.some((postTag) => {
          if (!postTag || typeof postTag !== "string") return false
          const normalizedPostTag = postTag.toLowerCase().trim().replace(/\s+/g, "-")
          return normalizedPostTag === normalizedCurrentTag
        })
      })

      console.log(`Tag "${tag}" (normalized: "${normalizedCurrentTag}") matched ${matchingPosts.length} posts`)

      if (matchingPosts.length === 0) {
        console.warn(`No posts matched the tag "${tag}"`)
        // Let's also log what tags are actually in the posts for debugging
        const allPostTags = posts.flatMap((p) => p.tags || []).filter(Boolean)
        console.log("Available tags in posts:", [...new Set(allPostTags)])
      }

      return matchingPosts
    },
  },
}
