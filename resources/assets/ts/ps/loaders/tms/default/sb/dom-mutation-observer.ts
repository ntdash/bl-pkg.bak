function callback () {

	const MutationConfig: MutationObserverInit = {childList: true, subtree: true};

	function MutationCallback (mutations: MutationRecord[]) {

		const cbList = nt.observers;

		if(!(cbList instanceof Array) || cbList.length < 0)
		return false;

		for(let record of mutations)
		for(let elt of record.addedNodes)
		for(let cb of cbList) {

			let found: Node | false = false;

			if(cb.cond(elt))
				found = elt;
			else {
				if(elt instanceof HTMLElement)
					elt.querySelectorAll('*')
					.forEach(s => { if(cb.cond(s)) found = s; })
			}

			if(found) {
				try {cb.callback(found)}
				catch($e) { console.log($e) }
			}
		}
	}

	const Ob = new MutationObserver(MutationCallback);

	Ob.observe(document.body, MutationConfig);
}


const tms: Tms = {

	label: "dom_mutation_observer",
	priority: 3,
	fallback: {delay: 2000},
	callback
}

export default tms;
