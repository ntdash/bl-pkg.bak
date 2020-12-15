import DefaultRepository from "./default"
import CriticalError from "../../error/critical"


class Loader implements TmsLoader {

	#logs: TmsLogRepository;
	#queue: Tms[];

	/** active tms log */
	#log: TmsLog;

	#tms: Tms;

	constructor() {

		this.#queue = DefaultRepository;
		this.#logs = [];

		// active tms & log initialization ...
		this.#log = this.initLog(true) as TmsLog;

		this.#tms = {label: "", callback: new Function};


		// save log globaly
		(window as any)['logs'] = this.#logs;
	}

	private initLog(r:boolean = false) {

		this.#log = { label: "", state: 0 };

		if(r === true)
		return this.#log;
	}


	private loadRepository(repository: Pmd['tms'])
	{
		const repo:Tms[] = [];

		for(let k of ['preset', 'current'])
		{
			let resolved = repository[k as ('preset' | 'current')] || [];

			if(k === 'current' && resolved.length <= 0)
				if(repository.pages)
					resolved.push(...( repository.pages[nt.data.params.pagename] || []));

			repo.push(...resolved);
		}

		return repo;
	}


	private executeTms(tms: Tms) {

		try {
			// execute [tms.callback]
			tms.callback();

			// observer if needed
			if(tms.observe)
				nt.observers.push(tms.observe);

			// change log state
			this.#log.state = 1;
		}
		catch($e) {

			const pr = tms.priority;

			if(tms.fallback) {

				let callback = this.resolveFallback();

				if(! callback || ! (callback instanceof Function))
				throw `TmsError: Undefined [Fallback.callback] of Tms: ${tms.label}`;

				callback();
			}

			// crach process if priority is high
			if(pr === 3)
			throw $e;
		}

		console.log(this.#log);

		this.report();
	}



	private executeCurrentQueue(log: boolean = false): Promise<void> {


		const resolve = (rs: any, rj: any) => {

			for( let tms; tms = this.#queue.shift(); ) {

				this.#tms = tms;

				// check if the current tms has already been excuted
				if(fn.data.find(this.#logs, {label: this.#tms.label, state: 1}))
				continue;


				// hydrate tms.label
				this.#log.label = this.#tms.label;


				// resolve dependencies related form [tms.depend_on] property
				if(this.resolveDepencies())
				continue;

				// execute tms.callback

				this.executeTms(this.#tms);

				// resolveAttached

				this.resolveAttach();
			}

			if(log)
			console.log(this.#logs);

			rs();
		}

		return new Promise(resolve.bind(this));
	}



	private resolveDepencies() : boolean | undefined {

		const dependencies = this.#tms.depend_on;

		if(! (dependencies instanceof Array) ||  dependencies.length <= 0)
		return false;

		const search = [this.#tms];

		for(let dp_name; dp_name = dependencies.shift(); )
		{
			const found = fn.data.find(this.#logs, {label: dp_name});

			if(found)
			{

				if(found.state === 1)
				continue;

				throw new CriticalError({log: found.msg || `[${found.label}] as Tms dependencie had failed to run !`});

			}
			else
			{
				const tms = fn.data.find(this.#queue, {label: dp_name});

				if(! tms) {

					console.error(`${dp_name} not registered as Tms !`);
					break;
				}

				search.unshift(tms);
			}
		}

		if(search.length > 1)
		{
			this.#log.state = 2;

			this.report();

			this.#queue.unshift(...search);

			return true;
		}
	}


	private resolveAttach() {

		if(! this.#tms.attach || ! (this.#tms.attach instanceof Array))
		return;


		for(let label; label = this.#tms.attach.pop(); ) {

			const tms = fn.data.find(this.#queue, {label});

			if(tms)
			this.#queue.unshift(tms);
		}
	}



	private resolveFallback() {

		const fall = this.#tms.fallback;

		let callback: Function | undefined;

		if(fall)
		{
			if(fall instanceof Function)
				callback = fall;

			else {

				if(fall.options.type === "reported" && fall.options.content)

					this.#queue.push(this.#tms);

				else
					this.RetryTms(this.#tms);

				return new Function;
			}
		}

		return callback;
	}


	private async RetryTms(tms: Tms) {

		const op = ((tms.fallback as TmsFallback).options as TmsFallbackRetryOptions).content;

		if(op.n-- > 0)
		{
			setTimeout( () => {
				this.#log.label = tms.label;
				this.executeTms(tms);
			}, op.delay);
		}

	}

	process ( repository: Pmd['tms'], last ?: Tms ) {

		this.#queue = this.loadRepository(repository);

		if(last)
			this.#queue.push(last);

		return this.executeCurrentQueue(env.debug);
	}

	postDefault () {

		// execute default Tms
		return this.executeCurrentQueue();
	}



	private report() {

		if(this.#log.label !== "")
			this.#logs.push(this.#log);

		this.initLog();
	}



}

export default Loader;
