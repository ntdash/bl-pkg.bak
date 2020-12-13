import PmdLoader from "./loaders"
import utils from "./utils/pmd-utils"

import CriticalError from "./error/critical"

class Application implements Starter {

	#config: HsConfig;

	#tms: TmsLoader
	#listeners: ListenerLoader

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
	private loadCurrent() {

		import(`hs/${this.resolveSection(this.#config.sections)}/app.ts`)
		.then(({default: pmd}) => {

			this.process( utils.refactor(pmd));
		})
		.catch($e => {

			throw new CriticalError({log: $e})
		});
	}

	/**
	 *
	 * @param filename dotted-filename [e.g: svc.dashboad -> svc/da1shboard]
	 * @param depth search recurvity [state at 1] [HostScopes && PagesScopes]
	 * 1 -> pages scopes
	 * 0 -> hosts (preset) scopes
	 */
	loadPart(filename: string, options ?: StaterLoadPartOptions, depth: number = 1) {


		import(`hs/${ this.resolvePartSection(filename, depth)}.part.ts`)
		.then(async ({default: pmd}) => {

			pmd = utils.refactor(pmd);

			this.#listeners.loadRepository(pmd.listeners);

			const log = this.#tms.process(pmd.tms);

			if(options)
			log
			.then(options.done)
			.catch(options.fail)
			.finally(options.complete);

		})
		.catch( $e => {

			if(depth > 0)
				return this.loadPart(filename, undefined, --depth);

			throw $e;
		 });

	}

	private resolvePartSection(filename: string, depth: number) : string {

		const params = nt.data.params;

		filename = filename.replace('.', '/');

		let resolve = "";

		resolve += `${params.container + (depth === 1 ? "/" + params.pagename : "") }/${filename}`;

		return `${resolve}.app`;
	}

	/**
	 * resolve requested script section [ pageName | sectionName ]
	 * @param sp SectionParams
	 */
	private resolveSection(repo: HsConfig['sections']) {

		/**
		 * proccess with en e.g
		 * params = {container: admin, name: update}
		 * repo -> [admin] = {type: "composed"}
		 */

		// get pages informations
		const params = nt.data.params;

		// resolve = "admin"
		let resolve = params.container;


		if( typeof repo === "object")
		{
			if(repo.options)
			{
				// search requested page-filename in repo
				let file =  fn.data.findFirst(repo.options, {name: params.pagename})

				if(file)
				resolve += `/pg/${ file.pathname || file.name }`;
			}
		}

		return resolve;

	}

	/**
	 *
	 */
	private async process(pmd: Pmd)
	{
		// calling requested tms...
		const r = await this.#tms.process(pmd.tms);

		// loading [default && global && currentPage] eventCallbacks
		this.#listeners.loadRepository(pmd.listeners);
	}


	start() {

		// resolve DOM State before loading Current-Page Scripts
		fn.dom.resolveReady( this.loadCurrent.bind(this));
	}
}

export default Application;
