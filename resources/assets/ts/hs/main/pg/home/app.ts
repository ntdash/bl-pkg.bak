
const md: SinglePmd = {

	tms: [
		{
			label: "test_retry",

			priority: 2,

			fallback: {

				options: {

					type: "retry",
					content: {
						n: 2,
						delay: 2000
					}
				},
				callback: () => {
					console.log("I'm the [fallback.callback]");
				}
			},

			callback: () => {
				console.log("starting");

				if(typeof nt.map !== "string")
				throw new Error("");

				console.log(nt.map);
			}
		}
	]
}


export default md;
