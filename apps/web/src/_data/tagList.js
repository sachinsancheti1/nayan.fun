import posts from "./posts.js"; // posts.js can be async; global data files support async

export default async function () {
  // Await posts if posts.js is async
  const allPosts = await posts();
  const tagSet = new Set();
  allPosts.forEach((post) => {
    if (post.tags) {
      let tags = Array.isArray(post.tags) ? post.tags : [post.tags];
      tags.forEach((tag) => {
        tagSet.add(tag.toLowerCase().trim().replace(/\s+/g, "-"));
      });
    }
  });
  console.log(...tagSet)
  return [...tagSet];
}