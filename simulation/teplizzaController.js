const db = require('../db');

class TeplizzaController {
	async saveEnvironmentLog (data) {
		try {
			const environment_log = data;
			const saveEnvironment = await db.query(
				`insert into environment_log (temperature, wetness, light, section_id, time_log) VALUES ($1, $2, $3, $4, now())`,
				[
						parseFloat(environment_log.temperature), 
						parseInt(environment_log.wetness), 
						parseInt(environment_log.light), 
						parseInt(environment_log.section_id)
				]
		);
			return saveEnvironment.rows;
		} catch (err) {
				console.error(err);
				throw new Error('DB Error');
			}
	}

	async getData () {
		try {
			const sections = await db.query('select * from sections order by id');
			const plants = await db.query('select * from plants order by section_id, number_in_section');
			const data = {sections: sections.rows, plants: plants.rows}
			return (data);
		} catch (err) {
			console.log(err);
			throw new Error('DB error');
		}
	}

};

module.exports = new TeplizzaController;