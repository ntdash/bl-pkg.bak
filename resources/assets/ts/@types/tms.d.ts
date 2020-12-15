interface TmsMutationOptions {

	/** Conditions that process the mutation callback */
	cond: (target: any) => boolean

	callback: Function
}




interface TmsFallbackOptions {

	type: 'retry' | 'reported'
	content: any
}


interface TmsFallback {

	/**
	 * switch(tms.priority)
	 * {
	 * 	case 'normal':
	 * 		tms.fallback = undefined | Function
	 *	case 'medium':
	 *		tms.fallback = undefined | {r: 0 | uncdefined > [?] <= 3}
	 *	case 'high':
	 *		tms.fallback = [include 'medium case' + crash process ]
	 * }
	 */

	options : TmsFallbackReportedOptions | TmsFallbackRetryOptions
	callback : Function
}


interface TmsFallbackReportedOptions extends TmsFallbackOptions {

	type: 'reported'
	content: boolean
}

interface TmsFallbackRetryOptions extends TmsFallbackOptions {

	type: 'retry'
	content: {
		n: 1|2|3,
		delay: number
	}
}



interface Tms {

	label: string
	/**
	 * Normal (1): allowed a fallback
	 *
	 * Medium (2): allowed fallback.options + [normal inclued]
	 *
	 * High (3): Crash process on Error + [medium inclued]
	 */
	priority ?: 1|2|3,

	depend_on ?: string[]

	attach ?: string[]

	observe ?: TmsMutationOptions,

	/**
	 * Allow you to fire a fallback function when an error occured while running the called [tms.callback]
	 * The behavior and accessibility depend on the property [tms.priority]
	 */
	fallback ?: Function | TmsFallback

	callback: Function
}

interface TmsLog {

	label: string
	msg ?: string

	others ?: Ob<any>

	/**
	 * failed: -1
	 *
	 * pending: 0
	 *
	 * loaded: 1
	 *
	 * reported: 2
	 */
	state: -1|0|1|2
}

interface TmsLogRepository extends Array<TmsLog> {}


// --------------------------------------------------------------------------------------

interface TmsLoader
{
	postDefault: () => Promise<void>
	process: (repository: Pmd['tms'], last ?: Tms ) => Promise<void>
}
