import { PartialProcess as process } from "./pmd-fn";

import CriticalError from "scripts/ps/error/critical"

import ApplicationWrapper from "./wrapper";

// Partiel Loader

class PartialLoader extends ApplicationWrapper
{

	async load(filename: string, options ?: StaterLoadPartOptions, depth: number = 1) {

		const section = this.resolvePartielSection(filename, depth);

		const response = import(`hs/${ section }.part.ts`);

		response
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

	private resolvePartielSection(path: string, depth: number) : string {

		const params = nt.data.params;

		const filename = path.replace('.', '/');

		const resolve = `${params.container + (depth === 1 ? "/" + params.pagename : "") }/${filename}`;

		return `${resolve}/app`;
	}
}


const Instance = new PartialLoader;

const loadPartial = Instance.load;


export { loadPartial }
export default Instance;
