export default async function updateMSPdb(library) {
	let albums = [];

	library.forEach((band) => {
		if (band?.albums?.length) {
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
								rec['@_type'] = 'node';
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
									rec['@_type'] = 'node';
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
						delete track.url;
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

	return albums;
}
