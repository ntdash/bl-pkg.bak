const tms: Tms = {

	label: "listeners_mounting",
	depend_on: ["page_data_extracter"],
	observe: {
		cond: (elt) => elt instanceof HTMLElement && elt.hasAttribute(vr.listeners.mounting_attr_query),
		callback: (elt: HTMLElement) => { nt.app.mount (elt) }
	},
}

export default tms;
