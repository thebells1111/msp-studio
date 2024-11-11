export default function normalizeSplits(arr, name, rssErrors) {
	// Helper function to normalize individual splits
	function normalize(splits) {
		// Convert strings to numbers
		let rounded = splits.map((num) => parseFloat(num));

		// Find the factor to scale up the splits
		let scale = Math.pow(
			10,
			Math.max(
				...rounded.map((num) => {
					let decimals = (num.toString().split('.')[1] || '').length;
					return decimals;
				})
			)
		);

		// Scale all splits by the found factor
		let scaled = rounded.map((num) => Math.round(num * scale));

		return scaled;
	}

	// Extract all '@_split' values from the array
	const splits = arr.map((obj) => parseFloat(obj['@_split']));

	// Normalize the extracted splits
	const normalizedSplits = normalize(splits);

	// Update the original array with the normalized splits
	return arr.map((v, i) => {
		const person = v?.['@_name'] || `Person #${i + 1}`;
		if (!v?.['@_name']) {
			rssErrors.push(`"${person}" in the "${name}" value tag block needs a name`);
		}
		if (!v?.['@_type']) {
			v['@_type'] = 'node';
		}
		if (!v?.['@_customKey']) {
			delete v['@_customKey'];
		}
		if (!v?.['@_customValue']) {
			delete v['@_customValue'];
		}
		if (!v?.['@_address']) {
			rssErrors.push(`"${person}" in the "${name}" value tag block needs an lightning address`);
		}

		if (!Number(v?.['@_split'])) {
			rssErrors.push(`"${person}" in the "${name}" value tag block needs a split`);
		}
		return {
			...v,
			'@_split': normalizedSplits[i].toString() // Convert back to string
		};
	});
}
