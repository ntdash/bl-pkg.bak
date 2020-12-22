interface ListenerRepository {

	[id:string]: EventListener
}

interface ListenerRepositoryGroup {

	/**  Global Scopes */
	global : ListenerRepository

	/**  Host Scopes */
	preset: ListenerRepository

	/**  Current-page Scopes */
	current: ListenerRepository
}



interface mountEventStoreItem
{
	types: string[],
	listenerName: string
}


// --------------------------------------------------------------------------------------

interface ListenerLoader {

	loadRepository: (collections: Pmd['listeners']) => void

	process: (stack: Pmd['listeners']) => void

	mount: (elt: HTMLElement) => void
}
