import { _newFeed } from '$/stores';

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
		}
	}

	return clonedObj; // Return the modified clone
}
