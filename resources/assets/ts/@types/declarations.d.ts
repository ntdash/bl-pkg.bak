declare const vr: UtilsConstants;
declare const fn: UtilsFunctions;
declare const nt: GlobalStore;


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
	cai: Object
}
