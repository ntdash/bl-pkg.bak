import PmdLoader from "./loaders"

class Application implements Starter {

	#config: HsConfig;
	// temps
	#tms: Object
	#listeners: Object

	constructor (config: HsConfig)  {

		// Init
		this.init();

		// Set config
		this.#config = config;

		// Init pages modules loaders
		this.#tms = new PmdLoader.tms
		this.#listeners = new PmdLoader.listeners
	}

	/**
	 * Global Variable Initialization
	 */
	private init() {

		Object.assign(nt, {
			app: this,
			cai: {}
		});
	}

	/**
	 * Load Current Application's Pages Script
	 */
	private loadCurrent()
	{

	}

	start()
	{
		// resolve DOM State before loading Current-Page Scripts
		fn.dom.resolveReady( this.loadCurrent.bind(this));
	}
}

export default Application;
