import DefaultRepository from "./default"
import CriticalError from "../../error/critical"


class Loader implements TmsLoader {

	#logs: TmsLogRepository;
	#queue: Tms[];


	constructor() {

		this.#queue = DefaultRepository;
		this.#logs = [];

		// init GlobalStore.obeservers for DOM-Mutation-Observers
		Object.assign(nt, {observers: []});

		// save logs globaly
		(window as any)['logs'] = Object.assign(this.#logs, {

			find: function (label: string) {

				return Array.prototype.find.call(this, (e) => e.label === label);
			}
		});
	}

	private initLog(): TmsLog {

		return {

			label: "",
			state: 0,
			t: {
				start: performance.now(),
				rtime:0,
				finish: 0
			}
		};
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


	private executeTms(tms: Tms, skipReport: boolean = false, log: TmsLog = this.initLog()) {


		try {

			if("callback" in tms || "observe" in tms) {

				// execute [tms.callback]
				if(tms.callback)
				tms.callback();

				// observer if needed
				if(tms.observe)
				nt.observers.push(tms.observe);

				// change log state
				log.state = 1;
			}
			else
			throw `Missing the following properties ['observer', 'callback'] on Tms: "${ (tms as Tms).label }"`;


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


		if(! skipReport) {

			this.report(log);

			if(log.state === -1 && tms.priority === 3)
			throw log.msg;

			return;
		}

		return log;

	}


	private executeCurrentQueue(log: boolean = false): Promise<void> {


		const resolve = (rs: any, rj: any) => {

			for( let tms; tms = this.#queue.shift(); ) {

				// init
				let log = this.initLog();

				// hydrate
				log.label = tms.label;

				// check if the current tms has already been excuted without error
				if(fn.data.find(this.#logs, {label: tms.label, state: 1}))
				continue;


				// resolve dependencies related form [tms.depend_on] property
				if(this.resolveDepencies(tms, log))
				continue;


				// execute tms.callback
				this.executeTms(tms, false, log);


				// resolveAttached
				this.resolveAttach(tms);
			}


			if(log)
			console.log(this.#logs);


			rs();
		}

		return new Promise(resolve.bind(this));
	}



	private resolveDepencies(tms: Tms, log: TmsLog) : boolean | undefined {

		const dependencies = tms.depend_on;


		if(! (dependencies instanceof Array) ||  dependencies.length <= 0)
		return;

		if(tms.observe)
		dependencies.unshift('dom_mutation_observer');


		const search = [tms];


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

			log.state = 2;

			this.report(log);

			this.#queue.unshift(...search);

			return true;
		}
	}


	private resolveAttach(tms: Tms) {

		if(! tms.attach || ! (tms.attach instanceof Array))
		return;


		for(let label; label = tms.attach.pop(); ) {

			const tms = fn.data.find(this.#queue, {label});

			if(tms)
			this.#queue.unshift(tms);
		}
	}



	private resolveFallback(tms: Tms) {

		const fall = tms.fallback;

		let callback: Function | -1 | undefined;

		if(fall) {


			if(! (fall instanceof Function)) {


				if(( typeof fall === 'boolean' && fall === true) || ('options' in fall && fall.options === true ))
				this.#queue.push( Object.assign(tms, { fallback: (fall as TmsFallback).callback }));


				else if( typeof fall === "object" ) {

					let state = [
						'delay' in fall,

						'options' in fall && (

							typeof fall.options === "object"
							&&
							typeof fall.options.delay === "number"

						)
					];

					if(state[0] || state[1])
					this.RetryTms(Object.assign(tms, {fallback: undefined}), {...(state[1] ? fall : {options: fall}) as TmsFallback });

				}

				return -1;
			}
			else
			callback = fall;
		}

		return callback;
	}


	private async RetryTms(tms: Tms, fall: TmsFallback) {

		const op = (fall.options as TmsFallbackRetryOptions);

		let retry_limit = (op.n || 1);

		if( retry_limit < 0 || retry_limit > 3)
		return;




		const resolve = () => {

			// init
			let log = this.initLog();

			// hydrate
			log.label = tms.label;


			this.executeTms(tms, true, log);


			if(log.state === 1)
			return this.report(log);


			if(--retry_limit > 0) {

				if(retry_limit > 1)
				log.state = 2;

				this.report(log);

				setTimeout(resolve, op.delay);
			}
			else {

				if(fall.callback instanceof Function)
				fall.callback();


				if(tms.priority === 3)
				throw log.msg;
			}

		}

		setTimeout(resolve, op.delay);

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

	private report(log: TmsLog) {

		const end = performance.now();

		Object.assign(log.t, {end, rtime: end - log.t.start})

		if(log.label !== "")
			this.#logs.push(log);

	}


}

export default Loader;
