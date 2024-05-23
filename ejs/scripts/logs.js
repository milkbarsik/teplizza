var now_log = 1;
var globalLogs;

async function fetchGlobalLogs() {
	globalLogs = await (await fetch(`http://localhost:5555/api/plant/${sectionNum}/${0}`)).json();
}
document.addEventListener('DOMContentLoaded', async () => {
	await fetchGlobalLogs();
	display_log(now_log, globalLogs);
});

document.addEventListener('click', async (e) => {
	const id = e.target?.dataset?.id || null;
	const button = e.target?.dataset?.button || null;
	if(id) {
		const data_logs = await fetch(`http://localhost:5555/api/plant/${sectionNum}/${id}`);
		const logs = await data_logs.json();
		globalLogs = logs;
		
		display_log(now_log, globalLogs);
	}
	if(button) {
		display_log(parseInt(button), globalLogs);
	}
});

function display_log (type_log, logs) {
	const log_name = document.getElementById('log_name');
	type_log == 1 ? log_name.innerText = 'environment-log' : (type_log == 2 ? log_name.innerText = 'watering-log' : log_name.innerText = 'feed-log');
	if(!logs) {
		now_log = type_log;
		return;
	}
//	console.log(logs);
		const logsContainer = document.querySelector('.logs');
		logsContainer.innerHTML = '';

	// p.number_in_section, w.time_log, s.person_name, s.surname, s.patronymic
	if(type_log == 1) {
		logs.environment_log.forEach(log => {
			const logRow = document.createElement('div');
			logRow.className = 'log-row';
			logRow.innerHTML = `<p>
				t: ${log.temperature}C</br>
				f: ${log.wetness}%</br>
				e: ${log.light}Lx</br>
				time: ${moment(log.time_log).format('DD-MM-YYYY HH:mm:ss')}</br>
				</p>`;  // Предполагая, что log.message содержит текст лога
			logsContainer.appendChild(logRow);
		});
	}
	if (type_log == 2) {
		logs.watering_log.forEach(log => {
			const logRow = document.createElement('div');
			logRow.className = 'log-row';
			logRow.innerHTML = `<p>
				№: ${log.number_in_section} ${log.name_of_plant}</br>
				time: ${moment(log.time_log).format('DD-MM-YYYY HH:mm:ss')}</br>
				stuff: ${log.person_name} ${log.surname} ${log.patronymic} </br>
			</p>`;
			logsContainer.appendChild(logRow);
		});
	}
	if(type_log == 3) {
		logs.feed_log.forEach(log => {
			const logRow = document.createElement('div');
			logRow.className = 'log-row';
			logRow.innerHTML = `<p>
				№: ${log.number_in_section} ${log.name_of_plant}</br>
				time: ${moment(log.time_log).format('DD-MM-YYYY HH:mm:ss')}</br>
				stuff: ${log.person_name} ${log.surname} ${log.patronymic} </br>
			</p>`;
			logsContainer.appendChild(logRow);
		});
	}
	now_log = type_log;
}

