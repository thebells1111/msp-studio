import { writable } from 'svelte/store';
import { dev } from '$app/environment';

export const remoteServer = dev ? 'http://localhost:3000' : '';

export const indexSearchResults = writable([]);
export const library = writable([]);

export const user = writable({ loggedIn: false });
export const currentModal = writable();
export const showTutorial = writable(false);
export const feedFile = writable();

export const feeds = writable({});
export const editingFeed = writable();

export const selectedBand = writable({ title: '', artwork: '', albums: [] });
export const selectedBandIndex = writable(-1);
export const newBand = writable({
	title: '',
	artwork: '',
	albums: []
});

export const selectedAlbum = writable({ title: '', artwork: '', tracks: [] });
export const selectedAlbumIndex = writable(-1);
export const newAlbum = writable({
	title: '',
	artwork: '',
	description: '',
	explicit: 'no',
	tracks: [],
	value: [
		{
			name: 'Music Side Project',
			address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			key: '696969',
			value: 'UzrnTK2oEHR55gw7Djmb',
			split: 5
		}
	]
});

export const selectedTrack = writable({});
export const selectedTrackIndex = writable(-1);
export const newTrack = writable({
	title: '',
	artwork: '',
	url: '',
	description: '',
	explicit: 'no',
	value: [
		{
			name: 'Music Side Project',
			address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			key: '696969',
			value: 'UzrnTK2oEHR55gw7Djmb',
			split: 5
		}
	]
});

export const MSPValue = writable({
	'@_name': 'Music Side Project',
	'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	'@_customKey': '696969',
	'@_customValue': 'UzrnTK2oEHR55gw7Djmb',
	'@_split': '5',
	'@_type': 'node'
});

export const newPerson = writable({
	'@_name': '',
	'@_address': '',
	'@_customKey': '',
	'@_customValue': '',
	'@_split': '',
	'@_type': 'node'
});

export const selectedScreen = writable('bands');
export const playingTrack = writable({});
export const player = writable();
export const playerTime = writable(0);
export const playerDuration = writable(0);
export const playerSaveTime = writable(0);
export const posterSwiper = writable();
export const satsPerTrack = writable(0);
export const satsPerBoost = writable(1000);
export const senderName = writable('');
