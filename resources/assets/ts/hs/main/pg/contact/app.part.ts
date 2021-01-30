import {reload} from "scripts/ps/starter/utils/partial-loader"

const pmd: SinglePmd = {
	tms: [
		{
			label: "partial_test",
			callback: () => {
				console.log("I'm a partiel");
			},
		},
	],
	listeners: {
		testBtn: (e: Event) => {}
	},
	html: {
		wp: "contact-wp",
		content: "/contact",
	},
};

export default pmd;
