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

		Object.assign(nt.cai, {[this.#name]: null});
	}
}

export default Component;
