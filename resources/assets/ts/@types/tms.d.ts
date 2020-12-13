interface TmsMutationOptions
{
	/** Conditions that process the mutation callback */
	cond: (target: any) => boolean

	callback: Function
}

interface Tms {

	label: string
	/**
	 * lvl
	 * 	1 - normal
	 * 	2 - medium - [retry >= 3 - default = 0] allowed before report only
	 * 	2 - high - [retry >= 3 - default = 1] allowed before report and crash
	 */
	priority: number,

	depend_on ?: string[]

	attach ?: string[]

	observe ?: TmsMutationOptions,

	/**
	 * allow string type "retry_$n" if (tms.priority > 1)
	 * with $n = retry number
	 */
	failback ?: Function | {r: number, callback: Function}

	callback: Function
}

interface TmsLog {
	label: string
	msg ?: string
	/**
	 * @ {failed: -1}
	 * @ {pending: 0}
	 * @ {loaded: 1}
	 * @ {reported: 2}
	 */
	state: number
}

interface TmsLogRepository extends Array<TmsLog> {}


// --------------------------------------------------------------------------------------

interface TmsLoader
{
	postDefault: () => Promise<void>
	process: (collections: Pmd['tms']) => Promise<void>
}
