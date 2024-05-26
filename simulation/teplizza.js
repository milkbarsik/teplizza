const WebSocket = require('ws');
const { controller, wss } = require('./teplizzaController');

class Teplizza {
	#sections;
	#staff;
	#staffSchedule;

	constructor(sections = new Set(), staff = []) {
		this.#sections = sections;
		this.#staff = staff;
		this.#staffSchedule = 0;
	}

	async createEnvironmentLogs() {
		for (let section of this.#sections) {
				await section.createEnvironmentLog();
		}
		wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message: 'Environment logs updated', type: 'environment' }));
      }
    });
	}

	async updateSection (sectionId, data) {
		const changeSection = Array.from(this.#sections).find(section => section.getId() == sectionId);
		const {environmentName, changeData} = data;
		await changeSection.setEnvironment(environmentName, changeData);
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ message: 'update', type: 'home' }));
			}
		});
	}

	deletePlant(plantId) {
		Array.from(this.#sections).forEach(section => {section.deletePlant(plantId)});
	}

	async waterAndFeedLevelControl () {
		for (let section of this.#sections) {
			for (let plant of section.getPlants()) {
				plant.water_level--;
				if(plant.water_level <= 0) {
					console.log(plant);
					await controller.createWaterAndFeedLog({plantId: plant.id, staffId: Math.floor(this.#staffSchedule / 2) + 1, level: plant.default_water_level}, {typeLog: 'watering_log', typeData: 'water_level'});
					plant.water_level = plant.default_water_level;
					wss.clients.forEach((client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(JSON.stringify({ message: `полив ${plant.number_in_section} ${plant.name_of_plant}`, sectionId: plant.section_id}));
						}
					});
				};
				plant.feed_level--;
				if(plant.feed_level <= 0) {
					console.log(plant);
					await controller.createWaterAndFeedLog({plantId: plant.id, staffId: Math.floor(this.#staffSchedule / 2) + 1, level: plant.default_feed_level}, {typeLog: 'feed_log', typeData: 'feed_level'});
					plant.feed_level = plant.default_feed_level;
					wss.clients.forEach((client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(JSON.stringify({ message: `подкорм ${plant.number_in_section} ${plant.name_of_plant}`, sectionId: plant.section_id}));
						}
					});
				};
				await controller.changeWaterAndFeedLevel ({water_level: plant.water_level, feed_level: plant.feed_level, id: plant.id});
			}
		}
		if(this.#staffSchedule++ == this.#staff.length * 2 - 1) {
			this.#staffSchedule = 0;
		}
	}

	async changeWaterAndFeedLevel (plantId, data) {
		for (let section of this.#sections) {
			for (let plant of section.getPlants()) {
				if (plant.id == plantId) {
          const { default_water_level, default_feed_level } = data;
					console.log(default_water_level, default_feed_level);
          if (!isNaN(parseInt(default_water_level))) {
						plant.water_level += parseInt(default_water_level) - plant.default_water_level;
						plant.default_water_level = parseInt(default_water_level);
					}
          if (!isNaN(parseInt(default_feed_level))) {
						plant.feed_level += default_feed_level - plant.default_feed_level;
						plant.default_feed_level = parseInt(default_feed_level);
					}
        }
			}
		}
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

	getPlants() {
		return this.#plants;
	}

	deletePlant (id) {
		const plant = Array.from(this.#plants).find(plant => plant.id == id);
		if(plant) {
			console.log(plant);
			this.#plants.delete(plant);
		}
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
	const staff = [];
	data.staff.forEach(person => {
		staff.push(person);
	});
	const teplizzaObject = new Teplizza(sections, staff);
	setInterval(async () => {await teplizzaObject.createEnvironmentLogs(); /*await teplizzaObject.waterAndFeedLevelControl()*/}, 3600000);
	setInterval(async () => {await teplizzaObject.waterAndFeedLevelControl()}, 600000);
	console.log('teplizza is started');
	return teplizzaObject;
}
module.exports = main();