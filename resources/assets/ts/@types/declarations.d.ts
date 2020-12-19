declare const vr: UtilsConstants;
declare const fn: UtilsFunctions;
declare const nt: GlobalStore;

declare const env: WkpsaceEnvPreset;


declare const logs: TmsLogRepository;

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


	/** [Mutation Observers Cond] bind to the property, [observe], of each Tms requesting the monitoring of some HTMLElements */
	observers: TmsMutationOptions[]
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
