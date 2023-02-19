import { writable } from 'svelte/store';

export const indexSearchResults = writable([]);
export const library = writable([]);
export const selectedBand = writable({});
export const selectedAlbum = writable({});
export const selectedTrack = writable({});
export const playingTrack = writable({});
export const player = writable();
export const playerTime = writable(0);
export const playerDuration = writable(0);
export const playerSaveTime = writable(0);
export const posterSwiper = writable();
export const satsPerTrack = writable(0);
export const satsPerBoost = writable(1000);
export const senderName = writable('');
export const user = writable({
	name: '',
	balance: 0,
	loggedIn: false,
	preferences: { wallet: 'albyApi' }
});
