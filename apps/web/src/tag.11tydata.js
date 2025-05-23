export default {
  pagination: {
    data: "tagList", // Global data defined in src/_data/tagList.js
    size: 1,
    alias: "tag"
  },
  permalink: ({ tag }) => `/tags/${tag}/`,
  eleventyComputed: {
    title: ({ tag }) => `Posts tagged “${tag}”`,
    posts: ({ tag, posts }) => {
      if (!posts || posts.length === 0) {
        console.warn("Global posts data is empty in tag.11tydata.js");
        return [];
      }
      // Use the same normalization as in tagList.js
      const normalize = str => str.toLowerCase().trim().replace(/\s+/g, "-");
      const matchingPosts = posts.filter(post => {
        if (!post.tags) return false;
        return post.tags.some(t => normalize(t) === tag);
      });
      if (matchingPosts.length === 0) {
        console.warn(`No posts matched the tag "${tag}"`);
      }
      return matchingPosts;
    }
  }
};
