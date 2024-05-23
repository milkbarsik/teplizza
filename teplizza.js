class teplizza {
	#sections;
	#staff;
	constructor(sections = new Set(), staff = new Set()) {
		this.#sections = sections;
		this.#staff = staff;
	}

	createLogs() {
		this.#sections.forEach(section => {
			section.createLog();
		})
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

class section {
	#temperature;
	#wetness;
	#light;
	#plants;

	constructor(temperature = 0, wetness = 0, light = 0, plants = new Set()) {
		this.#temperature = temperature;
		this.#wetness = wetness;
		this.#light = light;
		this.#plants = plants;
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

	createLog() {

	}
}