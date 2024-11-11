export default function convertTime(time, max) {
	try {
		let formatTime;
		if (max) {
			if (max < 3599) {
				formatTime = new Date(time * 1000).toISOString().substr(14, 5);
			} else {
				formatTime = new Date(time * 1000).toISOString().substr(11, 8);
			}
		} else {
			if (time < 3599) {
				formatTime = new Date(time * 1000).toISOString().substr(14, 5);
			} else {
				formatTime = new Date(time * 1000).toISOString().substr(11, 8);
			}
		}
		if (formatTime.charAt(0) === '0') {
			return formatTime.substring(1);
		}

		return formatTime;
	} catch {
		(err) => console.log(err);
	}
}
