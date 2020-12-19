interface TmsMutationOptions {

	/** Conditions that process the mutation callback */
	cond: (target: any) => boolean

	callback: Function
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

	 /**
	  * true for reported
	  * TmsfallbackRetryOptions for retry_mode
	  */
	options: true | TmsFallbackRetryOptions
	callback ?: Function
}

interface TmsFallbackRetryOptions {

	n ?: 1|2|3,
	delay: number
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
	 *
	 * [retry option] allowed a less than 3 times execution from the [tms.callback] -> [ +n | +delay]
	 *
	 * The behavior and accessibility depend on the property [tms.priority]
	 */
	fallback ?:  TmsFallback | TmsFallbackRetryOptions | true | Function

	callback: Function
}

interface TmsLog {

	label: string
	msg ?: string

	others ?: {
		last_retry ?: boolean
	}

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

	/**
	 * Performance times
	 */
	t: {
		start: number
		rtime: number
		finish: number
	}
}

interface TmsLogRepository extends Array<TmsLog> {
}

// --------------------------------------------------------------------------------------

interface TmsLoader
{
	postDefault: () => Promise<void>
	process: (repository: Pmd['tms'], last ?: Tms ) => Promise<void>
}
