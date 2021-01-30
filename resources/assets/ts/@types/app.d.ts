interface Starter {

	start: () => void
}


interface PartialLoaderCallbacks
{
	done ?: VoidFunction
	fail ?: VoidFunction
	complete ?: VoidFunction
}


// ------------------------------------------------------------


interface HsConfigSectionOptionItem {

	name: string,
	pathname ?: string
}

interface HsConfigSection {

	composed: boolean
	options ?: Array<  HsConfigSectionOptionItem >
}

interface HsConfig {

	sections: Ob<HsConfigSection>
}

// ------------------------------------------------------------


interface PmdHtmlOptions {

	type ?: 'link' | 'html'
	wp: string
	content: string
}

/**
 *
 * PmdHtmlResolvedOptions
 */
interface PHOR extends PmdHtmlOptions{
	type: 'link' | 'html'
}


interface SinglePmd {

	listeners ?: {
		current ?: ListenerRepository,
		preset: ListenerRepository
	} | ListenerRepository

	tms ?: Tms[]

	/**
	 * string format
	 * link => "->|(externe_link: https://localhost | same_protocolo: //localhost | interne_link: /contact)"
	 * content => "=>|innerHTML"
	 */
	html ?: PmdHtmlOptions | PmdHtmlOptions[]
}

interface MultiPmd {

	preset ?: SinglePmd
	pages: Ob<SinglePmd>
}

interface PmdRepositoryItem <T> {

	preset ?: T
	current ?: T
	pages ?: Ob<T>
}

interface Pmd {

	listeners: PmdRepositoryItem<ListenerRepository>
	tms: PmdRepositoryItem<Tms[]>

	html ?: SinglePmd['html']
}
