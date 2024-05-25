const db = require('../db');

class Controller {
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
      const plants = await db.query('select * from plants where section_id = $1', [id]);
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
			res.json(changes.rows);
		} catch (err) {
			console.error(err);
			res.status(500).send('DB Error');
		}
	}
}

module.exports = new Controller();