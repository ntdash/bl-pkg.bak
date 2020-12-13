declare const vr: UtilsConstants;
declare const fn: UtilsFunctions;
declare const nt: GlobalStore;

declare const env: WkpsaceEnvPreset;

/**
 *
 * Global variable
 */
interface GlobalStore {

	// Application Instance
	app: Starter,

	/**
	 * CAI as Current Active Instance ...
	 * <br/>
	 * Global instance Store for current active Instance as [form, alert, dropdown, all-components...]
	 */
	cai: Ob<Object>


	/** current page data */
	data: {

		/** current page info */
		params: {

			/**
			 * Requested HostName
			 */
			container: string,

			/**
			 * Requested Page Name
			 */
			pagename: string
		}
	}
}


interface WkpsaceEnvPreset
{

	/**
	 * static url path [prod || dev]
	 */
	assetsURL: string,

	/**
	 * debug
	 */
	debug: boolean
}
