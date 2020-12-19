function callback () {

	const [ config, callback ] : [MutationObserverInit, MutationCallback] =
		[
			{ childList: true, subtree: true },

			function(mutations) {

				const cbList = nt.observers;

				if(!(cbList instanceof Array) || cbList.length < 0)
				return false;


				mutations.forEach( record =>
				{

					record.addedNodes
					.forEach( elt =>
					{

						cbList.forEach( cb =>
						{
							if( cb.cond(elt) )
								try { cb.callback(elt) } catch ($e) { console.error($e) }

						});
					});

				})
			}

		];

		const Ob = new MutationObserver(callback);

		Ob.observe(document.body, config);
}


const tms: Tms = {

	label: "dom_mutation_observer",
	priority: 3,
	fallback: {delay: 2000},
	callback
}

export default tms;
