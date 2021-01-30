interface PartialLog {
	label: string;
	type: "loading" | "reloading";
	state: "pending" | "reported" | "loaded" | "failed";
}

interface PartialLogs extends Array<PartialLog> {}

interface PartialLoaderOptions {
	filename: string;
	callbacks?: PartialLoaderCallbacks;
}

interface PartialLoaderResolvedOptions extends PartialLoaderOptions {
	type: "reloading" | "loading";
}

import ApplicationWrapper from "./wrapper";
import { PartialProcess as process } from "./pmd-fn";

// Partiel Loader

class PartialLoader extends ApplicationWrapper {
	#logs: PartialLogs;

	constructor() {
		super();
		this.#logs = [];

		(window as any)["partial_logs"] = Object.assign(this.#logs);
	}

	load(arg: PartialLoaderOptions | string) {
		const data = this.resolveOptions(arg);

		if (
			data &&
			!fn.data.find(this.#logs, { label: data.filename, state: "loaded" })
		)
			this.process(data);
	}

	reload(arg: PartialLoaderOptions | string) {
		const data = this.resolveOptions(arg, true);

		if (data) this.process(data);
	}

	private resolveOptions(
		data: string | PartialLoaderOptions,
		reload: boolean = false
	): PartialLoaderResolvedOptions | false {
		if (
			(typeof data !== "object" || !("filename" in data)) &&
			typeof data !== "string"
		)
			return false;

		const resolve: PartialLoaderResolvedOptions = {
			filename: "",
			callbacks: {},
			type: reload ? "reloading" : "loading",
		};

		return Object.assign(
			resolve,
			typeof data === "object" ? data : { filename: data }
		);
	}

	private process(data: PartialLoaderResolvedOptions, depth: number = 1) {
		const report: PartialLog = {
			label: data.filename,
			type: data.type,
			state: "pending",
		};

		const section = this.resolvePartielSection(data.filename, depth);
		const response = import(`hs/${section}.part.ts`);

		response
			.then(({ default: pmd }) => {
				pmd = this.refactor(pmd);

				const response = process(pmd, true);

				if (response && data.callbacks)
					response
						.then(data.callbacks.done)
						.catch(data.callbacks.fail)
						.finally(data.callbacks.complete);

				Object.assign(report, { state: "loaded" });
			})
			.catch(() => {
				Object.assign(report, { state: "failed" });

				if (depth > 0) {
					Object.assign(report, { state: "reported" });
					return this.process(data, --depth);
				}
			})
			.finally(() => {
				this.report(report);
			});
	}

	private resolvePartielSection(path: string, depth: number): string {
		const params = nt.data.params;

		const filename = path.replace(".", "/");

		const resolve = `${
			params.container + (depth === 1 ? "/" + params.pagename : "")
		}/${filename}`;

		return `${resolve}/app`;
	}

	private report(log: PartialLog, msg?: any) {
		this.#logs.push(log);

		if (log.state === "failed") console.error(msg);
	}
}

const Instance = new PartialLoader();

const load = Instance.load.bind(Instance);
const reload = Instance.reload.bind(Instance);

export { load, reload };
export default Instance;
