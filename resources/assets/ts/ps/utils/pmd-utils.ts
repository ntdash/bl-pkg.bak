

class PmdUtils {

	refactor(pmd: SinglePmd | MultiPmd ) : Pmd {

		// Empty Repository
		const refactored: Pmd = {tms: {}, listeners: {}};

		// return empty repository if pmd is null
		if(! pmd)
		return refactored;

		// check if pmd is single or multiple
		const multi = 'pages' in pmd;

		if(! ('pages' in pmd)) {

			/**
			 * SinglePmd - Part
			 * process if pmd got [tms | listeners] as key(s)
			 */
			if('tms' in pmd || 'listeners' in pmd)

			Object.assign(refactored, {
				tms: {current: this.resolveTmsInput(pmd.tms)},
				listeners: {current: pmd.listeners || {}}
			});

		}
		else {

			// fill preset value

			if('preset' in pmd)
			{
				Object.assign(refactored, {
					tms: {preset: pmd.preset?.tms || []},
					listeners: {preset: pmd.preset?.listeners || []}
				});
			}

			// add 'pages' property to [pmd.tms && pmd.listeners]

			Object.assign(refactored.listeners, {pages: {}})
			Object.assign(refactored.tms, {pages: {}})

			// fill pages value

			for(let p in pmd.pages)
			{
				Object.assign(refactored.listeners.pages, {[p]: pmd.pages[p].listeners || {}});
				Object.assign(refactored.tms.pages, {[p]: pmd.pages[p].tms || []});
			}
		}

		return refactored;
	}

	// allowed Single pmd to export a function as Tms
	private resolveTmsInput( tms ?: Tms | Tms[] | VoidFunction) {

		if(typeof tms === "object")
		return tms instanceof Array ? tms : [tms];

		else if(typeof tms === "function")
		return [{ label: `${nt.data.params.pagename}_main_script`, callback: tms }];

		return [];
	}

}

export default new PmdUtils;
