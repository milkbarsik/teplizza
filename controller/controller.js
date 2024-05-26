const db = require('../db');
const teplizzaPromise = require('../simulation/teplizza');


class Controller {
	#teplizza;

	constructor() {
		this.initialize();
	}

	async initialize() {
			this.#teplizza = await teplizzaPromise;
	}

  async getSections(req, res) {
    try {
      const sections = await db.query('select * from sections order by id');
      res.json(sections.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('DB Error');
    }
  }

  async getSection(req, res) {
    try {
      const id = parseInt(req.params.id);
      const plants = await db.query('select * from plants where section_id = $1 order by number_in_section', [id]);
			const section = await db.query('select * from sections where id = $1', [id]);
      res.json({plants: plants.rows, section: section.rows});
    } catch (err) {
      console.error(err);
      res.status(500).send('DB Error');
    }
  }

	async getLogs (req, res) {
		try {
			const sectionNum = parseInt(req.params.sectionNum);
			const id = parseInt(req.params.id);
			const environment_log = await db.query('select * from environment_log where section_id = $1 order by time_log desc', [sectionNum]);
			const watering_log = await db.query('select p.name_of_plant, p.number_in_section, w.time_log, s.person_name, s.surname, s.patronymic from watering_log w join plants p on p.id = w.plant_id join staff s on s.id = w.staff_id where w.plant_id = $1 order by time_log desc', [id]);
			const feed_log = await db.query('select p.name_of_plant, p.number_in_section, f.time_log, s.person_name, s.surname, s.patronymic from feed_log f join plants p on p.id = f.plant_id join staff s on s.id = f.staff_id where f.plant_id = $1 order by time_log desc', [id]);
			res.json({
				environment_log: environment_log.rows,
				watering_log: watering_log.rows,
				feed_log: feed_log.rows,
			});
		} catch (err) {
			console.error(err);
			res.status(500).send('DB Error');
		}
	}

	async updateEnvironment (req, res) {
		try {
			const sectionNum = req.params.sectionNum;
			const {name, data} = req.body;
			const changes = await db.query(`update sections set ${name} = $1 where id = $2 returning *`, [data, sectionNum]);
			await this.#teplizza.updateSection(sectionNum, {environmentName: name, changeData: data});
			res.json(changes.rows);
		} catch (err) {
			console.error(err);
			res.status(500).send('DB Error');
		}
	}

	async deletePlant (req, res) {
		try {
			const id = req.params.id;
			console.log(id);
			await db.query('delete from plants where id = $1', [id]);
			this.#teplizza.deletePlant(id);
			res.status(200);
		} catch (err) {
			console.error(err);
			res.status(500).send('DB Error');
		}
	}

	async changeWaterAndFeedLevel (req, res) {
		try {
			const id = req.params.id;
			const {default_water_level, default_feed_level} = req.body;
			const dataPlant = await db.query('select * from plants where id = $1', [id]);
			const data = dataPlant.rows[0];
			let changeWater, changeFeed;
			if(!isNaN(default_water_level)) {
				changeWater = await db.query('update plants set default_water_level = $1 , water_level = $2 where id = $3 returning *', [parseInt(default_water_level), (data.water_level - data.default_water_level + parseInt(default_water_level)), id]);
			} if(!isNaN(default_feed_level)) {
				changeFeed = await db.query('update plants set default_feed_level = $1 , feed_level = $2 where id = $3 returning *', [parseInt(default_feed_level), (data.feed_level - data.default_feed_level + parseInt(default_feed_level)), id]);
			}
			this.#teplizza.changeWaterAndFeedLevel(id, req.body);
			res.json({default_water_level: changeWater, default_feed_level: changeFeed});
		} catch (err) {
			console.error(err);
			res.status(500).send('DB Error');
		}
	}
}

module.exports = new Controller();