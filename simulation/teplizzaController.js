const db = require('../db');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3333 });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

class TeplizzaController {
	async saveEnvironmentLog (data) {
		try {
			const environment_log = data;
			const saveEnvironment = await db.query(
				`insert into environment_log (temperature, wetness, light, section_id, time_log) VALUES ($1, $2, $3, $4, now()) returning *`,
				[
						parseFloat(environment_log.temperature), 
						parseInt(environment_log.wetness), 
						parseInt(environment_log.light), 
						parseInt(environment_log.section_id)
				]
		);
			// return await saveEnvironment.rows[0];
		} catch (err) {
				console.error(err);
				throw new Error('DB Error');
			}
	}

	async createWaterAndFeedLog (data, type) {
		try {
			const saveLog = await db.query(`insert into ${type.typeLog} (plant_id, staff_id, time_log) values ($1, $2, now())`, [parseInt(data.plantId), parseInt(data.staffId)]);
			const updateData = await db.query(`update plants set ${type.typeData} = $1 where id = $2`, [parseInt(data.level), parseInt(data.plantId)]);
		} catch (err) {
			console.error(err);
			throw new Error('DB Error');
		}
	}

	async changeWaterAndFeedLevel (data) {
		try {
			const { water_level, feed_level, id } = data;
			console.log(water_level, feed_level, id);
			await db.query('update plants set water_level = $1 , feed_level = $2 where id = $3', [water_level, feed_level, id]);
		} catch (err) {
			console.error(err);
			throw new Error('DB Error');
		}
	}

	async getData () {
		try {
			const sections = await db.query('select * from sections order by id');
			const plants = await db.query('select * from plants order by section_id, number_in_section');
			const staff = await db.query('select * from staff order by id');
			const data = {sections: sections.rows, plants: plants.rows, staff: staff.rows}
			return (data);
		} catch (err) {
			console.log(err);
			throw new Error('DB error');
		}
	}
};

module.exports = {controller: new TeplizzaController, wss: wss };