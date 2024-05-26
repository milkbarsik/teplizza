const ws = new WebSocket('ws://localhost:3333');
const updated = false;
ws.onopen = () => {
	console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {

}

ws.onclose = () => {
	console.log('Disconnected from WebSocket server');
};

ws.onerror = (error) => {
	console.error('WebSocket error:', error);
};

if (localStorage.getItem('homeUpdated') === 'true') {
	localStorage.removeItem('homeUpdated');
	window.location.reload();
}