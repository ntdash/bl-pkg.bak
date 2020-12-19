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
		(window as any)['logs'] = Object.assign(this.#logs, {

			find: function (label: string) {

				return Array.prototype.find.call(this, (e) => e.label === label);
			}
		});
	}

	private initLog(r:boolean = false) {

		const init = { label: "", state: 0, t: {start: performance.now(), rtime:0, finish: 0}} as TmsLog;

		if(r)
		return init;

		else
		this.#log = init;
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


	private executeTms(tms: Tms = this.#tms, skipReport: boolean = false) {

		let log = this.#log;

		// get tms priority
		const pr = tms.priority;

		try {
			// execute [tms.callback]
			tms.callback();

			// observer if needed
			if(tms.observe)
				nt.observers.push(tms.observe);

			// change log state
			log.state = 1
		}
		catch($e) {

			Object.assign(log, {state: -1 , msg: {content: $e.message, stack: $e.stack}});

			/**
			 * tms.fallback
			 * - allowed to to report or retry less than 3 times then [tms.callback] when he occured some error [+ delay]
			 * - execute a callback [tms.fallback || tms.fallback.callback] after an occured error
			 */
			if(tms.fallback) {

				let callback = this.resolveFallback(tms);


				if(callback) {

					if(callback === -1)
					log.state = 2;


					else if(callback instanceof Function)
					callback();

					else
					throw `TmsError: Undefined [Fallback.callback] of Tms: ${tms.label}`;
				}
			}
		}


		if(! skipReport)
		this.report();

		if(log.msg && pr === 3 )
		throw log.msg;
	}


	private executeCurrentQueue(log: boolean = false): Promise<void> {


		const resolve = (rs: any, rj: any) => {

			for( let tms; tms = this.#queue.shift(); ) {

				// init log
				if(this.#log.label !== "")
				this.initLog();


				// [class scope for current tms]
				this.#tms = tms;


				// check if the current tms has already been excuted without error
				if(fn.data.find(this.#logs, {label: tms.label, state: 1}))
				continue;


				// hydrate tms.label
				this.#log.label = tms.label;


				// resolve dependencies related form [tms.depend_on] property
				if(this.resolveDepencies())
				continue;


				// execute tms.callback
				this.executeTms();


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

		let log = this.#log;

		if(! (dependencies instanceof Array) ||  dependencies.length <= 0)
		return false;

		const search = [this.#tms];

		for(let dp_name; dp_name = dependencies.shift(); ) {

			const found = fn.data.find(this.#logs, {label: dp_name});

			if(found) {

				if(found.state === 1)
				continue;

				throw new CriticalError({log: found.msg || `[${found.label}] as Tms dependencie had failed to run !`});

			}
			else {

				const tms = fn.data.find(this.#queue, {label: dp_name});

				if(! tms) {

					console.error(`${dp_name} not registered as Tms !`);
					break;
				}

				search.unshift(tms);
			}
		}

		if(search.length > 1) {

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



	private resolveFallback(tms: Tms) {

		const fall = tms.fallback;

		let callback: Function | -1 | undefined;

		if(fall) {

			console.log(fall);


			if(! (fall instanceof Function)) {

				if(typeof fall.options === "boolean" && fall.options === true)
				this.#queue.push( Object.assign(tms, {fallback: fall.callback}));

				else if(typeof fall.options === "object" && "delay" in fall.options)
				this.RetryTms( Object.assign(tms, {fallback: undefined}), fall);

				return -1;
			}
			else
			callback = fall;
		}

		return callback;
	}


	private async RetryTms(tms: Tms, fall: TmsFallback) {

		const op = (fall.options as TmsFallbackRetryOptions);

		let retry_limit = op.n || 1;

		if( retry_limit < 0 || retry_limit > 3)
		return;



		const resolve = () => {

			let resolved = false;

			this.#log.label = tms.label;


			this.executeTms(tms, true);



			if(this.#log.state === 1)
			resolved = true;


			if(retry_limit > 0)
			this.#log.state = 2;


			this.report();


			if(! resolved && --retry_limit >= 0)
			setTimeout(resolve, op.delay);

			else
				if(fall.callback instanceof Function)
				fall.callback();

		}

		resolve();




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

		const end = performance.now();

		Object.assign(this.#log.t, {end, rtime: end - this.#log.t.start})

		if(this.#log.label !== "")
			this.#logs.push(this.#log);

		this.initLog();
	}


}

export default Loader;
