const ws = new WebSocket('ws://localhost:3333');
const reloadButton = document.getElementById('reload');
const reload = document.querySelector('.reload');
const newData = document.getElementById('new-data');
reload.style.display = 'none'

reloadButton.addEventListener('click', () => {
	window.location.reload();
})


ws.onopen = () => {
	console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
	if (JSON.parse(event.data).sectionId == sectionNum) {
		console.log(JSON.parse(event.data).message);
		newData.innerText = JSON.parse(event.data).message;
		reload.style.display = 'flex';
	}
	if (JSON.parse(event.data).type == 'environment') {
		console.log(JSON.parse(event.data).message);
		newData.innerText = JSON.parse(event.data).message;
		reload.style.display = 'flex';
	}
	if (JSON.parse(event.data).type == 'home') {
		console.log(JSON.parse(event.data).message);
		localStorage.setItem('homeUpdated', 'true');
	}
}

ws.onclose = () => {
	console.log('Disconnected from WebSocket server');
};

ws.onerror = (error) => {
	console.error('WebSocket error:', error);
};