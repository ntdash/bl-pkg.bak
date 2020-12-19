import DefaultRepository from "./default"


class Loader implements ListenerLoader {

	#repository: ListenerRepositoryGroup;
	#pattern = /^\[([A-Za-z:,]+)\]:([A-Za-z0-9]{5,})$/;


	constructor() {
		this.#repository = { global: DefaultRepository, preset: {}, current: {}};
	}


	mount (elt: Element) {

		const params = this.retriveParams(elt.getAttribute('js-ebind') || "");

		if(params) {

			for(let param ; param = params.shift(); ) {

				const listener = this.resolveListener(param.listenerName);

				if(listener)
				for(let type; type = param.types.shift();)
				elt.addEventListener(type, listener);
			}
		}

	}


	retriveParams (attr: string)
	{

		if(attr === "")
		return false;

		const result: mountEventStoreItem[] = [];

		attr.replace(' ', '').split('|')
		.forEach(param =>
		{
			const fetch = param.match(this.#pattern);

			if(fetch && fetch.length === 3)
			{
				const sliced = fetch.slice(1)

				result.push({
					types: sliced[0].split(','),
					listenerName: sliced[1]
				});
			}
		});

		return result.length > 0 ? result : false;
	}


	resolveListener(name:string) {

		for(let k in this.#repository) {

			const stack = this.#repository[k as keyof ListenerRepositoryGroup];

			if(name in stack)
			return stack[name];

		}

		return false;
	}



	loadRepository(repository: Pmd['listeners']) {

		if(! repository)
		return;


		for(let k in repository) {

			let resolved: {k: 'current' | 'preset', l: ListenerRepository} = Object.assign({});

			switch(k) {

				case 'current':
				case 'preset':

					resolved = {k, l: repository[k] as ListenerRepository}
				break;
				case 'pages':

					resolved = {k: 'current', l: (repository.pages as Ob<ListenerRepository>)[nt.data.params.pagename]};
				break;
			}

			Object.assign(this.#repository, { [ resolved.k ]: resolved.l});
		}
	}
}

export default Loader;
