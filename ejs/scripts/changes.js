const inputPlace = document.getElementsByClassName('input-place');
const inputButton = document.getElementsByClassName('input-button');
for (let i = 0; i < inputButton.length; i++) {
	inputButton[i].addEventListener('click', async () => {
		const data = {
			name: `${i == 0 ? 'temperature' : i == 1 ? 'wetness' : 'light'}`,
			data: `${parseFloat(inputPlace[i].value)}`
		};
		console.log(data.data);
		if(!isNaN(data.data)) {
			await fetch(`http://localhost:5555/api/section/${sectionNum}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(window.location.reload());
		}
	});
}