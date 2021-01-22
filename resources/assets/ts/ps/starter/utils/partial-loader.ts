import { process } from "./pmd-fn";

import CriticalError from "scripts/ps/error/critical"

import ApplicationWrapper from "./wrapper";

// Partiel Loader

class PartialLoader extends ApplicationWrapper
{

	load(filename: string, options ?: StaterLoadPartOptions, depth: number = 1) {

		import(`hs/${ this.resolvePartielSection(filename, depth)}.part.ts`)
		.then(async ({default: pmd}) => {

			pmd = this.refactor(pmd);

			const log = process(pmd, true);

			if(log && options)
			log
			.then(options.done)
			.catch(options.fail)
			.finally(options.complete);

		})
		.catch( $e => {

			if(depth > 0)
			return this.load(filename, undefined, --depth);

			throw new CriticalError({log: $e});
		 });
	}

	private resolvePartielSection(filename: string, depth: number) : string {

		const params = nt.data.params;

		filename = filename.replace('.', '/');

		let resolve = "";

		resolve += `${params.container + (depth === 1 ? "/" + params.pagename : "") }/${filename}`;

		return `${resolve}/app`;
	}
}


const Instance = new PartialLoader;

const loadPartial = Instance.load;


export { loadPartial }
export default Instance;
