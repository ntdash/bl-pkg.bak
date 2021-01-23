import PmdLoader from "scripts/ps/loaders";

class PmdFn {
	#tms: TmsLoader;
	#html: HTMLLoader;
	#listeners: ListenerLoader;

	constructor() {
		this.#tms = new PmdLoader.tms();
		this.#html = new PmdLoader.html();
		this.#listeners = new PmdLoader.listeners();
	}

	postDefault() {
		return this.#tms.postDefault();
	}

	mount(elt: HTMLElement) {
		this.#listeners.mount(elt);
	}

	process(pmd: Pmd, r: boolean = false, partial: boolean = false) {

		/**
		 *  loading [default && global && currentPage] eventCallbacks
		 *  ld_mth as listener dynamical method
		 */

		const ld_mth = !partial ? "process" : "loadRepository";
		this.#listeners[ld_mth](pmd.listeners);

		// load Partial HTML
		if (pmd.html)
		this.#html.process(pmd.html);

		// calling requested tms...
		const log = this.#tms.process(pmd.tms);

		if (r)
		return log;
	}
}

const Instance = new PmdFn();

const [mount, PartialProcess] = [
	// mount method
	Instance.mount.bind(Instance),

	// revised process
	(pmd: Pmd, r: boolean = false) => Instance.process.call(Instance, pmd, r, true),
];

export { mount, PartialProcess };
export default Instance;
