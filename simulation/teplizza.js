const controller = require('./teplizzaController');

const main = async () => {
	const data = await controller.getData();

	class Teplizza {
		#sections;
		#staff;

		constructor(sections = new Set(), staff = new Set()) {
			this.#sections = sections;
			this.#staff = staff;
		}

		async createEnvironmentLogs() {
			Array.from(this.#sections).forEach(async (section, index) => {
					await section.createEnvironmentLog(index + 1);
			});
		}

		addSection(section) {
			this.#sections.add(section);
		}

		removeSection(section) {
			this.#sections.delete(section);
		}

		addStaff(member) {
			this.#staff.add(member);
		}

		removeStaff(member) {
			this.#staff.delete(member);
		}
	}

	class Section {
		#id;
		#temperature;
		#wetness;
		#light;
		#plants;

		constructor(id, temperature = 0, wetness = 0, light = 0, plants = new Set()) {
			this.#id = id;
			this.#temperature = temperature;
			this.#wetness = wetness;
			this.#light = light;
			this.#plants = plants;
		}
		getId() {
			return this.#id;
		}
		setTemperature(data) {
			this.#temperature = data;
		}
		setWetness(data) {
			this.#wetness = data;
		}
		setLight(data) {
			this.#light = data;
		}
		deletePlant(data) {
			this.#plants.delete(data);
		}
		addPlant(data) {
			this.#plants.add(data);
		}

		async createEnvironmentLog(index) {
			try {
				const logData = {
					temperature: this.#temperature,
					wetness: this.#wetness,
					light: this.#light,
					section_id: index
				}
				const log = await controller.saveEnvironmentLog(logData);
			} catch (err) {
				console.error(err);
			}
		}
	}

	const sections = new Set();
	data.forEach(sectionData => {
			const section = new Section(
					sectionData.id, 
					sectionData.temperature, 
					sectionData.wetness, 
					sectionData.light
			);
			sections.add(section);
	});

	const teplizzaObject = new Teplizza(sections);
	setInterval(async () => {await teplizzaObject.createEnvironmentLogs()}, 3600000);
	console.log('teplizza is started');
}
module.exports = main;