interface UtilsFunctions {


	dom: {

		/**
		 * Resolve Callback's Running After DOMContentLoaded >> Event <<
		 * @param callback: VoidFunction
		 * @returns void
		 */
		resolveReady: (callback: VoidFunction) => void,

		// /**
		//  * Get Given element's direct child by using query
		//  * @param elt: Element
		//  * @param query: string
		//  * @returns false | Element
		//  */
		// directChild: (elt: Element, query:string) => false | HTMLElement


		// /**
		//  * Extract classes from Array<string>
		//  * @param $classes ?: string[]
		//  * @return string
		//  */
		// extractClasses: ($classes ?: string[]) => string
	}
}
