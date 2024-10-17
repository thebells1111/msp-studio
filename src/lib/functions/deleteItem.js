export default async function deleteItem(title, fn) {
	let typedPrompt = prompt(
		`Are you sure you want to delete ${title}?\n` +
			`Type DELETE to delete ${title} from your catalog.`
	);

	if (typedPrompt?.toUpperCase() === 'DELETE') {
		console.log('deleted');
		fn();
	} else if (typedPrompt) {
		alert(`You typed "${typedPrompt}"". If you want to delete ${title}, try again and type DELETE`);
	}
}
