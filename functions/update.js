#!/usr/bin/env node
/*
Update stored content by pulling from a Google Sheet
*/
const path = require("path");
const fs = require("fs/promises");

const { searchBySSTS, getCrop, getArticles } = require("./utils/content-api.js");
const { getMediaData } = require("./utils/get-media-data.js");
const { auth, kv } = require("./utils/utilities.js");
const { processText } = require("./utils/text.js");

// ALERT! If you are using firebase, you'll need to add `|| functions.config().GAPI_CLIENT_EMAIL` to get the values.
process.env.GAPI_CLIENT_EMAIL = process.env.GAPI_CLIENT_EMAIL;
process.env.GAPI_PRIVATE_KEY = process.env.GAPI_PRIVATE_KEY;

// SET OUR TIME ZONE
process.env.TZ = "US/Eastern";

// The main google spreadsheet
// https://docs.google.com/spreadsheets/d/1L6kWV-9SxE8q8LbX9o-HbMO9qPxm4UIG9YgD7gglUtA/edit#gid=892955810
const SPREADSHEET_ID = "1L6kWV-9SxE8q8LbX9o-HbMO9qPxm4UIG9YgD7gglUtA";

const OUTPUT = path.join(__dirname, "data", "content.json");

// These strings correspond to `top` properties. If they are present in the data, then they will be processed with markdown. This is for conveniene
const MARKDOWN_BY_DEFAULT = ["intro", "explanation", "contributing"];

// MAIN DATA UPDATING: Will write to ./functions/data/content.json
async function update() {
	if (!SPREADSHEET_ID) return;
	const goot = await auth();
	const data = await goot.parse.table(SPREADSHEET_ID).catch(error => {
		console.error("!!! Gootenberg error: A blank spreadsheet tab will fail here.");
		console.error(error);
		process.exit();
	});

	// Process the data into our usable object. For any tab with "key" and "value" columns,
	// it will be turned into KV pairs. Otherwise, the array of objects is passed through.
	let sheets = {};
	for (let [tab, content] of Object.entries(data)) {
		// Tabs beginning with an underscore are skipped.
		if (tab.indexOf("_") === 0) continue;

		if (content[0] && "key" in content[0] && "value" in content[0]) {
			sheets[tab] = kv(content);
		} else {
			sheets[tab] = content;
		}
	}

	// A "top" tab is elevated into top-level properties
	const { top = null } = sheets;
	if (top) {
		delete sheets.top;
		sheets = { ...top, ...sheets };
	}

	// There is some stuff we probably will have and will want markdown'ed
	for (let m of MARKDOWN_BY_DEFAULT) {
		if (sheets[m]) sheets[m] = processText(sheets[m]);
	}

	// Coerce our dates to dates
	sheets.published = new Date(sheets.published) || Date.now();
	sheets.updated = new Date(sheets.updated) || Date.now();

	const links = await Promise.all(
		sheets.recirculation.map(async ({ presto_id, headline, link, image_presto_id }) => {
			if (presto_id) {
				const { assets } = await getArticles(presto_id);
				try {
					// Get the article information
					const { headline, title, shortHeadline, promoBrief, pageURL, links } =
						assets[0];

					// Get the photo text information
					const {
						asset: { crops },
					} = links.assets.find(a => a.id === links.photoId);

					// Get the crop information
					const { height, width, path } = crops.find(c => c.name === "16_9");

					return {
						headline: shortHeadline || headline || title || promoBrief || "",
						pageURL: pageURL.long,
						image: {
							height,
							width,
							src: path,
						},
					};
				} catch (e) {
					console.error(e);
				}
			} else {
				return {
					headline,
					pageURL: link,
					image: await getMediaData({ image: image_presto_id, crop: "16_9" }),
				};
			}
		})
	);

	// GET THE SSTS STORIES
	let stories = await searchBySSTS("sports/soccer/worldcup", { size: 5 });
	sheets.recirculation = [...links, ...stories.map(pickStoryProps)];

	return fs.writeFile(OUTPUT, JSON.stringify(sheets, null, 2));
}

// Takes an article asset from CAPI and returns the bits that we want
function pickStoryProps(story) {
	const {
		id,
		shortHeadline,
		headline,
		title,
		byline,
		updateDate,
		promoBrief,
		contentProtectionState,
	} = story;
	const pageURL = story.pageURL.long;

	// Process the image
	const { asset } = story.links.assets.find(asset => asset.id == story.links.photoId);

	const { path, width, height } = getCrop({
		crop: "16_9",
		crops: asset.crops,
	});
	const image = {
		width,
		height,
		src: path,
		// caption: asset.caption,
		// credit: asset.credit,
	};

	return {
		// id,
		headline: shortHeadline || headline || title,
		// byline,
		// updateDate,
		// promoBrief,
		// contentProtectionState,
		pageURL,
		image,
	};
}

if (require.main === module) {
	update().catch(console.error);
}

module.exports = { update };
