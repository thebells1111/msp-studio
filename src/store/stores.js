import clone from 'just-clone';
import __newFeed from './newFeed.js';
import _newTrack from './newTrack.js';
import _newPerson from './newPerson.js';
import _MSPValue from './MSPValue.js';
import __settings from './settings.js';

import { writable } from 'svelte/store';

import { dev } from '$app/environment';

export const remoteServer = dev ? 'http://localhost:8000' : 'https://curiohoster.com';

export const catalogDB = writable();
export const feedDB = writable();
export const indexSearchResults = writable([]);
export const library = writable([]);

export const showTutorial = writable(false);

export const _newFeed = __newFeed;
export const newFeed = writable(clone(_newFeed));
export const newTrack = writable(clone(_newTrack));
export const newPerson = writable(clone(_newPerson));
export const MSPValue = clone(_MSPValue);
export const _settings = __settings;
export const settings = writable(clone(_settings));
export const loggedIn = writable(false);

export const feeds = writable({});
export const editingFeed = writable();
export const selectedFeed = writable();

export const feedFile = writable();

export const menuPanel = writable('albums');
export const mainPanel = writable('editor');
