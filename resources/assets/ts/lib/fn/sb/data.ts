const utils = {

	find:  <T extends Ob<any>> (arr: Array<T>,  predicate: Ob<any>, options: DataFindOptions ) =>
	{
		const matches: T[] =  [];
		const matchesID: number[] = [];


		if(! (arr instanceof Array)) return false;

		const repo = [...arr];

		for( let item, i = 0; item = repo.shift(); i++) {

			let state = true;

			for(let k in predicate) {

				if(predicate[k] !== item[k]) {
					state = false;
					break;
				}
			}

			if(state) {

				if(options.first)
					return options.index ? i : item;

				matchesID.push(i);
				matches.push(item);
			}
		}

		return matches.length > 0 ? (options.index ? matchesID : matches) : false;
	}
}

const ob: UtilsFunctions['data'] = {

	find: <T extends Ob<any>> (arr: Array<T>,  predicate: Ob<any>) => utils.find.call(null, arr, predicate,  {first: true}) as false | T,

	findAll: <T extends Ob<any>> (arr: Array<T>,  predicate: Ob<any>) => utils.find.call(null, arr, predicate, {}) as false | T[],

	findIndex: <T extends Ob<any>> (arr: Array<T>,  predicate: Ob<any>) => utils.find.call(null, arr, predicate,  {first: true, index: true}) as false | number,

	findAllIndex: <T extends Ob<any>> (arr: Array<T>,  predicate: Ob<any>) => utils.find.call(null, arr, predicate,  {index: true}) as false | number[],

}

export default ob;
