const utils = {

	find:  <T extends Ob<any>> (collection: Array<T>,  predicate: Ob<any>, first: boolean = false ) =>
	{
		let res: Array<T> = [];

		// Iteration

		for(let item of collection)
		{
			const keys = Object.keys(predicate).reverse();
			let i = keys.length;

			for(; i > 0; i--)
			{
				if(item[keys[i-1]] !== predicate[keys[i-1]])
				break;

				if(i === 0)
					if(!first)
						res.push(item);
					else
						return item;
			}
		}

		return res.length > 0 ? res : false;
	}
}


const ob: UtilsFunctions['data'] = {

	findFirst: <T extends Ob<any>> (collection: Array<T>,  predicate: Ob<any>) => utils.find.call(null, collection, predicate, true) as false | T,

	findAll: <T extends Ob<any>> (collection: Array<T>,  predicate: Ob<any>) => utils.find.call(null, collection, predicate, false) as false | T[]

}

export default ob;
