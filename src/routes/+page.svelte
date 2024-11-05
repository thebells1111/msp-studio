<script>
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import Editor from '$lib/Editor/Editor.svelte';
	import generateValidGuid from '$functions/generateValidGuid.js';
	import updateMSPdb from '$functions/updateMSPdb.js';

	import {
		catalogDB,
		feedDB,
		feeds,
		loggedIn,
		_newFeed,
		remoteServer,
		editingFeed,
		_settings,
		settings
	} from '$/stores';

	let isLoading = true;

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
		//all of this catalogDB stuff is vestigal from MSP v1 and is used to xfr the db format
		$catalogDB = localforage.createInstance({
			name: 'catalogDB'
		});

		$feedDB = localforage.createInstance({
			name: 'feedDB'
		});

		$feedDB.keys().then(async function (keys) {
			let _feeds = keys.map((v) => $feedDB.getItem(v));
			$feeds = await Promise.all(_feeds);
			console.log($feeds);
			if (!$feeds.length) {
				$catalogDB
					.keys()
					.then(async function (keys) {
						let _catalog = keys.map((v) => $catalogDB.getItem(v));
						let library = await Promise.all(_catalog);

						let oldFormat = library.some((v) => v?.albums?.length);

						if (oldFormat) {
							$feeds = await updateMSPdb(library);

							let updated = $feeds.map(async (v, i) => {
								if (!v?.['podcast:guid']) {
									v['podcast:guid'] = generateValidGuid();
									await checkPodcastGuid(v);
								}
								$catalogDB.removeItem(keys[i]);
								return $catalogDB.setItem(v['podcast:guid'], v);
							});
							await Promise.all(updated);
						} else {
							$feeds = [];
						}

						$feeds = $feeds.map((v) => {
							v.item = (v.item || []).map((item) => addMissingKeys(item, _newFeed.item[0]));

							return addMissingKeys(v, _newFeed);
						});
					})
					.catch(function (err) {
						console.log(err);
					});
			}
			setTimeout(() => {
				isLoading = false;
			}, 1000);
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

	let updateTimeout;

	function updateFeeds() {
		if ($feedDB && $editingFeed?.['podcast:guid']) {
			clearTimeout(updateTimeout);
			$feeds = $feeds;
			updateTimeout = setTimeout(() => {
				console.log('Feed Saved');

				$feedDB.setItem($editingFeed['podcast:guid'], $editingFeed);
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
