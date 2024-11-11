export default function addMissingKeys(obj, template) {
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
