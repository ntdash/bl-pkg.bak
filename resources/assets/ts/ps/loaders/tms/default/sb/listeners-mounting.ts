function callback (wrapper ?: Element | Document) {

	if(! wrapper)
	wrapper = document;


	else {
		wrapper = document.createElement('div')
		wrapper.appendChild(wrapper);
	}


	wrapper.querySelectorAll(vr.listeners.mounting_query)
	.forEach(elt => {

		if(! (elt instanceof HTMLElement))
		return;

		nt.app.mount(elt);
	})
}


const tms: Tms = {

	label: "listeners_mounting",
	priority: 3,
	depend_on: ["page_data_extracter"],
	observe: {
		cond: (elt) => elt instanceof HTMLElement && elt.hasAttribute(vr.listeners.mounting_query),
		callback
	},
	fallback: {delay: 2000},
	callback
}

export default tms;
