import { writable } from "svelte/store";

// What controls should be shown?
export let mode = writable(null);

// Start the process of returning the character back to factory defaults
export let resetting = writable(false);
export let activeClothes = writable("jersey");
export let loaded = writable(0);
export let jerseyNumber = writable(null);
export let sharing = writable(false);
export let recirc = writable(false);
