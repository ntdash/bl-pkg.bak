interface Starter {
	start: () => void
}


interface HsConfigSectionOptionItem
{
	name: string,
	pathname?: string
}

interface HsConfigSection
{
	type: 'detach' | '*' | 'composed',
	options: Array<HsConfigSectionOptionItem>
}

interface HsConfig {
	sections: Ob<HsConfigSection>
}
