import PmdLoader from "scripts/ps/loaders"

class PmdFn {

	#tms: TmsLoader
	#html: HTMLLoader
	#listeners: ListenerLoader


	constructor () {
		this.#tms = new PmdLoader.tms;
		this.#html = new PmdLoader.html;
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

		// load Partial HTML
		if(pmd.html)
		this.#html.process(pmd.html);

		if(r)
		return log;
	}
}


const Instance = new PmdFn;
const [mount, process] = [Instance.mount, Instance.process]



export { mount, process }
export default Instance;
