class Component {

	#name ?: string;

	constructor ($name ?: string)
	{
		this.#name = $name;
		this.init();
	}

	private init()
	{
		if(! this.#name)
		throw `Undefined Component Name`;

		Object.assign(nt.cai, {[this.#name]: new Object});
		/**
		 * Note:
		 * 	prendre compte des multiples instances du même components this.#components_name = instance[] + les methodes et property suivants: [@find, #list]
		 *
		 * For another:
		 *
		 * 	DOMForm : {
		 * 		current: HTMLForm
		 * 		last: HTMLForm
		 * }
		 */
	}
}

export default Component;
