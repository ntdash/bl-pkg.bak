const ob: Tms = {

	label: "page_data_extracter",

	priority: 2,

	callback: () => {

		const scriptTag = document.scripts.namedItem('p-data');

		if(scriptTag)
		{
			const content = scriptTag.textContent;

			if(content)
			{
				const parsed = fn.json.decode(content, true);

				if(parsed && "params" in parsed)
				{
					Object.assign(nt, { data: parsed });
					return;
				}
			}
		}
	}
}


export default ob;
