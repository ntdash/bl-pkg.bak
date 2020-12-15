interface DataFindOptions {
	first ?: boolean,
	index ?: boolean
}


interface UtilsFunctions {

	data: {

		// find first data in DataCollection <ArrayLike>
		find: <T extends Ob<any>>(collection: Array<T>, predicate: Ob<any>) => false | T

		// find all datas in DataCollection <ArrayLike>
		findAll: <T extends Ob<any>>(collection: Array<T>, predicate: Ob<any>) => false | T[]



		findIndex: <T extends Ob<any>>(collection: Array<T>, predicate: Ob<any>) => false | number

		findAllIndex: <T extends Ob<any>>(collection: Array<T>, predicate: Ob<any>) => false | number[]


	}

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

	json: {
		/**
		 * Encode JSON
		 * @param ob: Ob<any>
		 * @return string
		 */
		encode: (ob: Ob<any>) => string | false

		/**
		 * Decode JSON
		 * @param str: string
		 * @param r: boolean
		 * @return Ob<any>
		 */
		decode: (str: string, r?: boolean) => false | Ob<any>
	}
}
