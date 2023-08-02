<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';

	async function getFeed(url) {
		try {
			let url = request.url.searchParams.get('url');
			console.log(url);
			const response = await fetch(url, {
				'User-Agent': 'CurioCaster'
			});
			const feed = (await response.text()) || {};
			const parserOptions = {
				attributeNamePrefix: '@_',
				ignoreAttributes: false,
				ignoreNameSpace: false,
				attrValueProcessor: (val, attrName) => decode(val),
				tagValueProcessor: (val, tagName) => decode(val)
			};
			xmlJson = parse(feed, parserOptions);
		} catch (err) {
			console.log('getFeeds Error:', err);
		}
	}
</script>
