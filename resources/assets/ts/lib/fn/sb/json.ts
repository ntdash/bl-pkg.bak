export default {

	encode: (ob: Ob<any>) => {

		try {
			return JSON.stringify(ob);
		}
		catch($e) {
			console.error(`JsonError: Failed to encode : ${ob}`);
			return false;
		}
	},


	decode: (str: string, r ?: boolean) => {
		try {
			let decode = JSON.parse(str);
			return r ? decode : true;
		}
		catch($e) {
			if(env.debug)
				console.error(`JsonError: Failed to decode : ${str}`);
			return false;
		}
	}
}
