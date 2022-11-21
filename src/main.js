import App from "./App.svelte";
import props from "../functions/data/content.json";

const app = new App({
	hydrate: true,
	target: document.getElementById(process.env.PROJECT_SLUG),
	props,
});

export default app;
