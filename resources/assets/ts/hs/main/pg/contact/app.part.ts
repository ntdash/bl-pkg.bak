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
		testBtn: (e: Event) => {
			console.log("welcome");
		}
	},
	html: {
		wp: "contact-wp",
		content: "/contact",
	},
};

export default pmd;
