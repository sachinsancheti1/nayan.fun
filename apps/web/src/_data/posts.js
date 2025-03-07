// @ts-check
import { AssetCache } from "@11ty/eleventy-fetch";
import Image from "@11ty/eleventy-img";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import slugify from "@sindresorhus/slugify";
import { config } from "dotenv";
import { isProduction } from "../../eleventy/utils.js";
import BlocksToMarkdown from "@sanity/block-content-to-markdown";
config();

// Environment variables
const projectId = process.env.SANITY_PROJECT_ID || 'j0ml5s7u';
const dataset = process.env.SANITY_DATASET || "production";
if (!projectId || !dataset) {
	throw new Error("SANITY_PROJECT_ID, SANITY_DATASET must be provided");
}

// Create a Sanity client instance
const client = createClient({
	projectId,
	dataset,
	useCdn: false, // `false` if you need fresh data
});

// Setup Sanity image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source) {
	return builder.image(source).url();
}

// Matching the expiry time of file URLs (if applicable)
const CACHE_DURATION = "1h";
const IMAGES_URL_PATH = "/images/remote/";
const IMAGES_OUTPUT_DIR = "./src/images/remote/";

// Fetch posts data from Sanity with caching
async function getSanityPostsData() {
	const postsCache = new AssetCache("sanity-image-gallery");

	if (postsCache.isCacheValid(CACHE_DURATION)) {
		console.log("Getting posts from cache.");
		return postsCache.getCachedValue();
	}

	console.log("Posts cache expired. Fetching data from Sanity API");

	// GROQ query matching the revised schema fields
	const query = `*[_type == "post"] | order(publishedOn desc) {
    title,
    notes,
    publishedOn,
    tags,
    "images": images[]{
    "image": asset->url,
    "alt": alt
    }
  }`;

	const posts = await client.fetch(query);
	await postsCache.save(posts, "json");
	return posts;
}

// Transform a Sanity post into the structure your code expects
function parsePostData(post) {
	const title = post.title || "";
	const notes = BlocksToMarkdown(post.notes);
	const date = new Date(post.publishedOn);
	const tags = post.tags || [];
	const slug = slugify(title);

	// Process images from the post.
	// Each image object is expected to have an "image" property for the URL
	// and an optional "alt" property for the alternative text.
	const images = (post.images || [])
		.map((figure) => {
			if (figure && figure.image) {
				return {
					url: figure.image,
					alt: figure.alt || "",
				};
			}
			return null;
		})
		.filter(Boolean);

	return { title, notes, date, tags, images, slug };
}

// Build our posts array from Sanity data
function createPosts(sanityData) {
	const posts = sanityData.map(parsePostData);
	console.log(JSON.stringify(posts));
	return posts;
}

// Fetch and process a remote image using eleventy-img
async function fetchRemoteImage(remoteUrl, alt) {
	if (typeof remoteUrl !== "string") {
		throw new Error(
			`Expected remoteUrl to be a string, got: ${typeof remoteUrl}`,
		);
	}

	const metadata = await Image(remoteUrl, {
		widths: [2600],
		outputDir: IMAGES_OUTPUT_DIR,
		urlPath: IMAGES_URL_PATH,
		formats: ["jpeg"],
		cacheOptions: {
			duration: CACHE_DURATION,
		},
		sharpJpegOptions: {
			quality: 100,
		},
	});

	if (!metadata || !metadata.jpeg || !metadata.jpeg.length) {
		throw new Error(`Image processing failed for ${remoteUrl}`);
	}

	const { width, height, url } = metadata.jpeg[0];
	return { width, height, url, alt };
}

// Process each post’s images
async function fetchRemoteImages(posts) {
	return await Promise.all(
		posts.map(async (post) => {
			const localImages = await Promise.all(
				post.images.map(({ url, alt }) => fetchRemoteImage(url, alt)),
			);
			return { ...post, localImages };
		}),
	);
}

const now = new Date();
function isFuturePost(post) {
	return post.date > now;
}

export default async function () {
	const rawData = await getSanityPostsData();
	let posts = createPosts(rawData);

	posts = await fetchRemoteImages(posts);

	if (isProduction) {
		posts = posts.filter((p) => !isFuturePost(p));
	}

	return posts;
}
