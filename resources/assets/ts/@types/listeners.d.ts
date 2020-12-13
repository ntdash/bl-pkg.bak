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




// --------------------------------------------------------------------------------------

interface ListenerLoader {

	loadRepository: (collections: Pmd['listeners']) => Promise<void>
}
