import { _newFeed, MSPValue } from '$/stores';
import clone from 'just-clone';

export default function initializeAlbum(obj) {
	// Clone the input object to avoid direct modification
	const clonedObj = JSON.parse(JSON.stringify(obj));

	// Check for existing keys in the cloned object
	const keysToCheck = Object.keys(_newFeed);
	const hasKeys = keysToCheck.some((key) => clonedObj.hasOwnProperty(key));

	// If keys are missing, clone them
	if (!hasKeys) {
		keysToCheck.forEach((key) => {
			if (!clonedObj.hasOwnProperty(key)) {
				clonedObj[key] = JSON.parse(JSON.stringify(_newFeed[key]));
			}
		});
	}

	clonedObj['podcast:aspectImages'] = [].concat(clonedObj['podcast:aspectImages']).filter(
		(entry, index, self) =>
			entry !== null &&
			index ===
				self.findIndex(
					(v) =>
						v !== null && // Check that v is not null
						v['@_aspect-ratio'] === entry['@_aspect-ratio'] &&
						v['@_src'] === entry['@_src']
				)
	);

	if (!clonedObj['podcast:aspectImages'].some((v) => v['@_aspect-ratio'] === '6/1')) {
		clonedObj['podcast:aspectImages'].push({
			'@_aspect-ratio': '6/1',
			'@_src': ''
		});
	}

	// Handle the item array
	if (!Array.isArray(clonedObj.item)) {
		clonedObj.item = Array.isArray(_newFeed.item) ? JSON.parse(JSON.stringify(_newFeed.item)) : [];
	} else {
		clonedObj.item = clonedObj.item.map((item) => {
			if (typeof item !== 'object') return item;

			const newItem = { ..._newFeed.item[0] }; // Clone structure from _newFeed.item
			for (const key in newItem) {
				if (!item.hasOwnProperty(key)) {
					item[key] = JSON.parse(JSON.stringify(newItem[key]));
				}
			}
			return item;
		});
	}

	// Exclude modification if 'podcast:medium' is 'publisher'
	if (clonedObj['podcast:medium'] === 'publisher') return clonedObj;

	// Check for item properties
	for (let i = 0; i < clonedObj.item.length; i++) {
		const item = clonedObj.item[i];
		for (const key in _newFeed.item[0]) {
			if (!item.hasOwnProperty(key)) {
				item[key] = JSON.parse(JSON.stringify(_newFeed.item[0][key]));
			}
			item['podcast:aspectImages'] = [].concat(item['podcast:aspectImages']).filter(
				(entry, index, self) =>
					entry !== null &&
					index ===
						self.findIndex(
							(v) =>
								v !== null && // Check that v is not null
								v['@_aspect-ratio'] === entry['@_aspect-ratio'] &&
								v['@_src'] === entry['@_src']
						)
			);

			if (!item['podcast:aspectImages'].some((v) => v['@_aspect-ratio'] === '6/1')) {
				item['podcast:aspectImages'].push({
					'@_aspect-ratio': '6/1',
					'@_src': ''
				});
			}
		}
	}

	let oldMSPValueIndex = clonedObj?.['podcast:value']?.['podcast:valueRecipient']?.findIndex(
		(v) =>
			v?.['@_address'] === '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3' &&
			v?.['@_customKey'] === '696969' &&
			v?.['@_customValue'] === 'UzrnTK2oEHR55gw7Djmb'
	);

	if (oldMSPValueIndex > -1 && clonedObj?.['podcast:value']?.['podcast:valueRecipient']) {
		clonedObj['podcast:value']['podcast:valueRecipient'][oldMSPValueIndex] = clone(MSPValue);
	}

	return clonedObj; // Return the modified clone
}
