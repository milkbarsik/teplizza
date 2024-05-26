const inputPlace = document.getElementsByClassName('input-place');
const inputButton = document.getElementsByClassName('input-button');
const deleteButton = document.getElementById('delete-button');
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

deleteButton.addEventListener('click', async () => {
	const confirmFrame = confirm('Подтвердите действие (delete plant)');
	if(!confirmFrame) {
		return;
	} else {
		await fetch(`http://localhost:5555/api/section/${parseInt(plantChanges.dataset?.plantId)}`,{
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'}
		}).then(window.location.reload());
	}
})

const plantInput = document.getElementsByClassName('plant-input');
const changeLevels = document.getElementById('change-levels');
changeLevels.addEventListener('click', async () => {
	const data = {
		default_water_level: `${parseInt(plantInput[0].value)}`,
		default_feed_level: `${parseInt(plantInput[1].value)}`,
	};
	if(!isNaN(data.default_water_level) || !isNaN(data.default_feed_level)) {
		const response = await fetch(`http://localhost:5555/api/levels/${parseInt(plantChanges.dataset?.plantId)}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		})
		const changeData = await response.json();
		if (changeData.default_water_level) {
			document.querySelector('#plant-water-level').innerText = `${changeData.default_water_level.rows[0].water_level} hours (${changeData.default_water_level.rows[0].default_water_level})`;
		} if (changeData.default_feed_level) {
			document.querySelector('#plant-feed-level').innerText = `${changeData.default_feed_level.rows[0].feed_level} hours (${changeData.default_feed_level.rows[0].default_feed_level})`;
		}
	}
	plantInput[0].value = plantInput[1].value = '';
})