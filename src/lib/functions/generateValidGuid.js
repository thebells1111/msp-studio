import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

export default async function generateValidGuid() {
	const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
	const inputString = uuidv4();
	const uniqueId = uuidv5(inputString, namespace);
	let url = `/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${uniqueId}`)}`;

	const res = await fetch(url);
	const data = await res.json();
	if (data?.feed?.length) {
		return generateValidGuid();
	} else {
		return uniqueId;
	}
}
