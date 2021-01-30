// Wp as Wrapper
import ApplicationWp from "./utils/wrapper"

import Pmdfn from "./utils/pmd-fn"

import {critical as CriticalError} from "scripts/ps/error"

class Application extends ApplicationWp implements Starter {

	#config: HsConfig;

	constructor (config: HsConfig)  {

		super();

		// Set config
		this.#config = config;
	}

	/**
	 * Load Current Application's Pages Script
	 */
	private async loadCurrent() {

		// wait for the default Tms[]
		await Pmdfn.postDefault();

		// load Current Tms[]
		import(`hs/${this.resolveSection(this.#config.sections)}/app.ts`)
		.then(({default: pmd}) => {

			Pmdfn.process( this.refactor(pmd));
		})
		.catch($e => {

			throw new CriticalError({log: $e})
		});
	}

	/**
	 *
	 * @param filename dotted-filename [e.g: svc.dashboad -> svc/da1shboard]
	 * @param depth allowed resursive search [state at 1] [HostScopes && PagesScopes]
	 * 1 -> pages scopes
	 * 0 -> hosts (preset) scopes
	 */


	/**
	 * resolve requested script section [ pageName | sectionName ]
	 * @param sp SectionParams
	 */
	private resolveSection(repository: HsConfig['sections']) {


		// get pages informations
		const params = nt.data.params;

		// resolve container scopes ...
		const repo = repository[params.container];


		let resolve = params.container;


		if( typeof repo === "object")
		{
			if(repo.options)
			{

				// search requested page-filename in repo
				let file =  fn.data.find(repo.options, {name: params.pagename});


				if(file)
				resolve += `/pg/${ file.pathname || file.name }`;
			}
		}

		return resolve;
	}


	start() {

		// resolve DOM State before loading Current-Page Scripts
		fn.dom.resolveReady( this.loadCurrent.bind(this));
	}
}

export default Application;
