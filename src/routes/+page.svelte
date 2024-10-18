<script>
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import Editor from '$lib/Editor/Editor.svelte';
	import generateValidGuid from '$functions/generateValidGuid.js';

	import {
		catalogDB,
		feeds,
		loggedIn,
		_newFeed,
		remoteServer,
		editingFeed,
		_settings,
		settings
	} from '$/stores';

	let isLoading = false;

	onMount(() => {
		fetch(remoteServer + '/api/msp/refresh', { method: 'GET', credentials: 'include' })
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				$loggedIn = data.status === 'success';
				$settings = data.settings || clone(_settings);
				console.log($settings);
			});

		$catalogDB = localforage.createInstance({
			name: 'catalogDB'
		});

		$catalogDB
			.keys()
			.then(async function (keys) {
				let _catalog = keys.map((v) => $catalogDB.getItem(v));
				const library = await Promise.all(_catalog);

				let oldFormat = library.some((v) => v?.albums?.length);

				if (oldFormat) {
					let albums = [];

					library.forEach((band) => {
						if (band?.albums?.length) {
							oldFormat = true;
							albums = albums.concat(
								band.albums.map((album) => {
									album['podcast:guid'] = album.guid;
									album['itunes:author'] = band.title;
									album['itunes:image'] = { '@_href': album.artwork || '' };
									album['podcast:value'] = {
										'@_type': 'lightning',
										'@_method': 'keysend',
										'podcast:valueRecipient': []
											.concat(album?.value)
											.filter((v) => v)
											.map((value) => {
												let rec = {};
												rec['@_name'] = value.name || '';
												rec['@_address'] = value.address || '';
												rec['@_customKey'] = value.key || '';
												rec['@_customValue'] = value.value || '';
												rec['@_split'] = Number(value.split) || 0;
												return rec;
											})
									};

									album.item = album.tracks.map((track) => {
										track['itunes:image'] = { '@_href': track.artwork || '' };
										track.enclosure = {
											'@_url': track?.enclosure?.url || '',
											'@_length': track?.enclosure?.enclosureLength || '',
											'@_type': track?.enclosure?.type
										};
										track['itunes:explicit'] = track?.explicit;

										track['podcast:value'] = {
											'@_type': 'lightning',
											'@_method': 'keysend',
											'podcast:valueRecipient': []
												.concat(track?.value)
												.filter((v) => v)
												.map((value) => {
													let rec = {};
													rec['@_name'] = value.name || '';
													rec['@_address'] = value.address || '';
													rec['@_customKey'] = value.key || '';
													rec['@_customValue'] = value.value || '';
													rec['@_split'] = Number(value.split) || 0;
													return rec;
												})
										};

										delete track.artwork;
										delete track.explicit;
										delete track.value;
										return track;
									});

									delete album.guid;
									delete album.artwork;
									delete album.value;
									delete album.tracks;

									return album;
								})
							);
						}

						if (band.item) {
							albums.push(band);
						}
					});

					$feeds = albums;

					let updated = albums.map(async (v, i) => {
						if (!v?.['podcast:guid']) {
							v['podcast:guid'] = generateValidGuid();
							await checkPodcastGuid(v);
						}
						$catalogDB.removeItem(keys[i]);
						return $catalogDB.setItem(v['podcast:guid'], v);
					});
					await Promise.all(updated);
				} else {
					$feeds = library;
				}
				console.log($feeds);

				$feeds = $feeds.map((v) => {
					v.item = (v.item || []).map((item) => addMissingKeys(item, _newFeed.item[0]));

					return addMissingKeys(v, _newFeed);
				});

				setTimeout(() => {
					isLoading = false;
				}, 1000);
			})
			.catch(function (err) {
				console.log(err);
			});
	});

	async function checkPodcastGuid(feed) {
		let url =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${feed['podcast:guid']}`)}`;
		console.log(url);
		const res = await fetch(url);
		const data = await res.json();
		if (data?.feed?.length) {
			feed['podcast:guid'] = generateValidGuid();
			await checkPodcastGuid(feed);
		}
	}

	function addMissingKeys(obj, template) {
		for (const key in template) {
			if (!(key in obj)) {
				obj[key] = template[key]; // Add missing key
			} else if (typeof template[key] === 'object' && !Array.isArray(template[key])) {
				addMissingKeys(obj[key], template[key]); // Recurse for nested objects
			} else if (Array.isArray(template[key])) {
				if (!Array.isArray(obj[key])) {
					obj[key] = template[key]; // Add missing array
				} else {
					obj[key].forEach((item, index) => {
						if (typeof item === 'object') {
							addMissingKeys(item, template[key][0]); // Recurse for each item in array
						}
					});
				}
			}
		}
		return obj;
	}

	function buildValue(tag, name) {
		let value = {
			'@_type': 'lightning',
			'@_method': 'keysend',
			'podcast:valueRecipient': tag.map((v, i) => {
				let rec = { '@_type': 'node' };
				let person = v.name;

				return rec;
			})
		};

		return value;
	}

	let updateTimeout;

	function updateFeeds() {
		if ($catalogDB && $editingFeed?.['podcast:guid']) {
			clearTimeout(updateTimeout);
			updateTimeout = setTimeout(() => {
				$feeds = $feeds;
				$catalogDB.setItem($editingFeed['podcast:guid'], $editingFeed);
				console.log('updated');
				console.log($editingFeed);
				console.log($feeds);
			}, 500);
		}
	}

	$: updateFeeds($editingFeed);
</script>

{#if isLoading}
	<div class="record-container">
		<img src="/msp-record-300.png" alt="Record" class="record" />
	</div>
{:else}
	<Editor />
{/if}

<style>
	.record-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
	}

	.record {
		height: 300px;
		width: 300px;
		animation: spin 2s infinite linear;
		border-radius: 50%;
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
