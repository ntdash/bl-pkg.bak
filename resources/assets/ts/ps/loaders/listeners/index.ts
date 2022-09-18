import DefaultRepository from "./default";

class Loader implements ListenerLoader {

	#repository: ListenerRepositoryGroup;
	#pattern = /^\[([A-Za-z:,]+)\]:([A-Za-z0-9]{3,})$/;

	constructor() {

		this.#repository = {
			global: DefaultRepository,
			preset: {},
			current: {},
		};

		(window as any)["listeners"] = this.#repository;
	}

	mount(elt: Element) {

		const params = this.retrieveParams(
			elt.getAttribute(vr.listeners.mounting_attr) || ""
		);

		if (params) {

			for (let param of params) {

				const listener = this.resolveListener(param.listenerName);

				if (listener) {
					for (let type of param.types) {
						elt.addEventListener(type, listener);
					}
				}
			}
		}
	}

	retriveParams(attr: string) {

		if (attr === "") return false;

		const result: mountEventStoreItem[] = [];

		attr.replace(" ", "")
			.split("|")
			.forEach((param) => {
				const fetch = param.match(this.#pattern);

				if (fetch && fetch.length === 3) {

					const sliced = fetch.slice(1);

					result.push({
						types: sliced[0].split(","),
						listenerName: sliced[1],
					});
				}
			});

		return result.length > 0 ? result : false;
	}

	process(stack: Pmd["listeners"]) {

		this.loadRepository(stack);

		document
		.querySelectorAll(vr.listeners.mounting_query)
		.forEach((elt) => {
			this.mount(elt);
		});
	}

	resolveListener(name: string) {

		for (let k in this.#repository) {

			const stack = this.#repository[k as keyof ListenerRepositoryGroup];

			if (name in stack) return stack[name];
		}

		return false;
	}

	loadRepository(repository: Pmd["listeners"]) {

		if (!repository) return;

		for (let k in repository) {

			let resolved: {
				k: "current" | "preset"
				l: ListenerRepository
			} = Object.assign({});

			switch (k) {

				case "current":
				case "preset":
					resolved = { k, l: repository[k] as ListenerRepository };
				break;

				case "pages":
					resolved = {
						k: "current",
						l: (repository.pages as Ob<ListenerRepository>)[
							nt.data.params.pagename
						],
					};
				break;
			}

			Object.assign(this.#repository, { [resolved.k]: resolved.l });
		}
	}
}

export default Loader;
