import PmdLoader from "scripts/ps/loaders"

class PmdFn {

	#tms: TmsLoader
	#listeners: ListenerLoader


	constructor () {
		this.#tms = new PmdLoader.tms;
		this.#listeners = new PmdLoader.listeners;
	}

	postDefault() {

		return this.#tms.postDefault();
	}

	mount(elt: HTMLElement) {

		this.#listeners.mount(elt);
	}


	process(pmd: Pmd, r: boolean = false)
	{

		// loading [default && global && currentPage] eventCallbacks
		this.#listeners.process(pmd.listeners);

		// calling requested tms...
		const log = this.#tms.process(pmd.tms);

		if(r)
		return log;
	}
}

export default new PmdFn;
