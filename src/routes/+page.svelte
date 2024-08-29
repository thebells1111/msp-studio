<script>
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import Editor from './Editor/Editor.svelte';

	import { catalogDB, feeds, user, wpFeedUrl } from '$/stores';

	let isLoading = false;

	onMount(() => {
		// fetch('/api/alby/refresh')
		// 	.then((res) => {
		// 		return res.json();
		// 	})
		// 	.then((data) => {
		// 		$user.loggedIn = data.loggedIn;
		// 		$user.name = data.name;
		// 	});

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
				setTimeout(() => {
					isLoading = false;
				}, 1000);
			})
			.catch(function (err) {
				console.log(err);
			});
	});

	function generateValidGuid() {
		const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
		const inputString = uuidv4();
		return uuidv5(inputString, namespace);
	}

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
