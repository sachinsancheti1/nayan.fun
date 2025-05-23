export default {
  eleventyComputed: {
    posts: ({ posts }) => {
      // Make sure posts data is available to the tags page
      return posts
    },
  },
}
