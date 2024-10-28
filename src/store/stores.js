import clone from 'just-clone';

import { writable } from 'svelte/store';

import { dev } from '$app/environment';

export const _newFeed = {
	description: '',
	explicit: 'no',
	item: [
		{
			description: '',
			enclosure: {
				['@_url']: '',
				['@_enclosureLength']: 33,
				['@_type']: 'mp3'
			},
			explicit: 'no',
			'itunes:image': { '@_href': '' },
			'podcast:aspectImages': [
				{
					'@_aspect-ratio': '6/1',
					'@_src': ''
				}
			],
			'podcast:value': {
				'@_type': 'lightning',
				'@_method': 'keysend',
				'podcast:valueRecipient': [
					{
						'@_name': 'Music Side Project',
						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
						'@_customKey': '696969',
						'@_customValue': 'UzrnTK2oEHR55gw7Djmb',
						'@_split': 5
					}
				]
			},
			title: ''
		}
	],
	'itunes:author': '',
	'itunes:image': { '@_href': '' },
	'podcast:aspectImages': [
		{
			'@_aspect-ratio': '6/1',
			'@_src': ''
		}
	],
	link: '',
	'podcast:guid': '',
	'podcast:value': {
		'@_type': 'lightning',
		'@_method': 'keysend',
		'podcast:valueRecipient': [
			{
				'@_name': 'Music Side Project',
				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
				'@_customKey': '696969',
				'@_customValue': 'UzrnTK2oEHR55gw7Djmb',
				'@_split': 5
			}
		]
	},
	title: ''
};

console.log(dev);

export const remoteServer = dev ? 'http://localhost:8000' : '';

export const catalogDB = writable();
export const indexSearchResults = writable([]);
export const library = writable([]);

export const currentModal = writable();
export const showTutorial = writable(false);

export const feedFile = writable();

export const feeds = writable({});

export const newFeed = writable(clone(_newFeed));

export const editingFeed = writable();

export const newTrack = writable({
	description: '',
	enclosure: {
		['@_url']: '',
		['@_enclosureLength']: 33,
		['@_type']: 'mp3'
	},
	explicit: 'no',
	'itunes:image': { '@_href': '' },
	'podcast:aspectImages': [
		{
			'@_aspect-ratio': '6/1',
			'@_src': ''
		}
	],
	'podcast:value': {
		'@_type': 'lightning',
		'@_method': 'keysend',
		'podcast:valueRecipient': [
			{
				'@_name': 'Music Side Project',
				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
				'@_customKey': '696969',
				'@_customValue': 'UzrnTK2oEHR55gw7Djmb',
				'@_split': 5
			}
		]
	},
	title: ''
});
export const uploadCB = writable(() => {});
export const uploadFileType = writable();
export const uploadFileText = writable();
export const wpFeedUrl = writable();

export const MSPValue = writable({
	'@_name': 'Music Side Project',
	'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	'@_customKey': '696969',
	'@_customValue': 'UzrnTK2oEHR55gw7Djmb',
	'@_split': 5
});

export const newPerson = writable({
	'@_name': '',
	'@_address': '',
	'@_customKey': '',
	'@_customValue': '',
	'@_split': 0
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
export const menuPanel = writable('albums');
export const loggedIn = writable(false);
export const _settings = {
	bunny: {
		active: false,
		username: '',
		hostname: '',
		password: '',
		apiKey: ''
	}
};
export const settings = writable(clone(_settings));
