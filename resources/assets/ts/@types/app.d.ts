interface Starter {

	mount: (elt: HTMLElement) => void
	start: () => void
}


interface StaterLoadPartOptions
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


interface SinglePmd {

	listeners ?: {
		current ?: ListenerRepository,
		preset: ListenerRepository
	} | ListenerRepository

	tms ?: Tms[]
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
}
