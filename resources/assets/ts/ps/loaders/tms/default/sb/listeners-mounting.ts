import { mount } from "scripts/ps/starter/utils/pmd-fn";

const tms: Tms = {
	label: "listeners_mounting",
	depend_on: ["page_data_extracter"],
	observe: {

		cond: (elt) =>
			elt instanceof HTMLElement &&
			elt.hasAttribute(vr.listeners.mounting_attr),

		callback: (elt: HTMLElement) => mount(elt),
	},
};

export default tms;
