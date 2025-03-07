// src/_data/metadata.js
import { createClient } from "@sanity/client";
import { AssetCache } from "@11ty/eleventy-fetch";
import { config } from "dotenv";
config();

// Environment variables
const projectId = process.env.SANITY_PROJECT_ID || 'j0ml5s7u';
const dataset = process.env.SANITY_DATASET || "production";
if (!projectId || !dataset) {
	throw new Error("SANITY_PROJECT_ID, SANITY_DATASET must be provided");
}

const client = createClient({
	projectId,
	dataset,
	useCdn: false, // Set to `true` if you want cached data
});

// Cache duration for the metadata (adjust as needed)
const CACHE_DURATION = "1h";

async function getMetadataData() {
	const metaCache = new AssetCache("sanity-metadata");

	if (metaCache.isCacheValid(CACHE_DURATION)) {
		console.log("Getting metadata from cache.");
		return metaCache.getCachedValue();
	}

	console.log("Metadata cache expired. Fetching data from Sanity API");

	// GROQ query to fetch the metadata document.
	// We assume there is a single document of type "metadata".
	const query = `*[_type == "metadata"][0] {
    title,
    subtitle,
    author,
    email,
    url,
    language
  }`;

	const data = await client.fetch(query);
	await metaCache.save(data, "json");
	console.log(data);
	return data;
}

export default async function () {
	const data = await getMetadataData();
	return data;
}
