const controller = require('./teplizzaController');

class Teplizza {
	#sections;
	#staff;

	constructor(sections = new Set(), staff = new Set()) {
		this.#sections = sections;
		this.#staff = staff;
	}

	async createEnvironmentLogs() {
		for (let section of this.#sections) {
				await section.createEnvironmentLog();
		}
	}

	async updateSection (sectionId, data) {
		const changeSection = Array.from(this.#sections).find(section => section.getId() == sectionId);
		const {environmentName, changeData} = data;
		await changeSection.setEnvironment(environmentName, changeData);
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

	async setEnvironment(environmentName, data) {
		environmentName == 'temperature' ? 
		this.#temperature = data : environmentName == 'wetness' ? 
		this.#wetness = data : this.#light = data;
		await this.createEnvironmentLog();
	}

	async createEnvironmentLog() {
		try {
			const logData = {
				temperature: this.#temperature,
				wetness: this.#wetness,
				light: this.#light,
				section_id: this.#id
			}
			await controller.saveEnvironmentLog(logData);
		} catch (err) {
			console.error(err);
		}
	}
}

const main = async () => {
	const data = await controller.getData();
	const sections = new Set();
	data.sections.forEach(sectionData => {
		const plants = new Set();
    for (const plantData of data.plants) {
        if (plantData.section_id == sectionData.id) {
            plants.add(plantData);
        } 
    }
			const section = new Section(
					sectionData.id, 
					sectionData.temperature, 
					sectionData.wetness, 
					sectionData.light,
					plants
			);
			sections.add(section);
	});

	const teplizzaObject = new Teplizza(sections);
	setInterval(async () => {await teplizzaObject.createEnvironmentLogs()}, 3600000);
	console.log('teplizza is started');
	return teplizzaObject;
}
module.exports = main();