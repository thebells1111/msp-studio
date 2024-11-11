import { _settings } from '$/stores';

export default function initializeSettings(obj) {
	for (const key in _settings) {
		if (!obj.hasOwnProperty(key)) {
			obj[key] = _settings[key];
		} else {
			for (const subKey in _settings[key]) {
				if (!obj[key].hasOwnProperty(subKey)) {
					obj[key][subKey] = _settings[key][subKey];
				}
			}
		}
	}
	return obj;
}
s;
