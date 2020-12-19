import DefaultRepository from "./default"


class Listeners {

	#repository: ListenerRepositoryGroup;
	#pattern = /^\[([A-Za-z:,]+)\]:([A-Za-z0-9]{5,})$/;


	constructor() {
		this.#repository = { global: DefaultRepository, preset: {}, pages: {}};
	}



	loadRepository(repository: Pmd['listeners']) {
		return Promise.resolve();
	}
}

export default Listeners;
