
const md: SinglePmd = {

	tms: [
		{
			label: "test_retry",

			priority: 2,

			fallback: {

				options: {delay: 5000},

				callback: () => {
					console.log("I'm the [fallback.callback]");
				}
			},

			callback: () => {
				console.log("starting");

				throw new Error("C'est de la merde");

			}
		}
	]
}


export default md;
