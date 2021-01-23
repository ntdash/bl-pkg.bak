/**
 * we 'll need
 * 	> type: link or DOM.textContent
 * 		> default = link
 *
 * 	> parent element [id] with [wp="async"] attr
 * 	> content: string = based on ob.type
 */



class Loader implements HTMLLoader {

	constructor () {}


	process(data: SinglePmd['html']) {

		if(! data)
		return;

		const repo:PmdHtmlOptions[] = [...(data instanceof Array ? data : [data])];

		repo
		.forEach(item => this.load( this.resolveOptions(item)));
	}

	private async load(data: PHOR)
	{

		const wp = this.getContentWrapper(data);

		if(!wp)
		throw `Dynamic content's wrapper is missing`;

		const content = await this.getContent(data);

		if(! content)
		throw `Emtpy Dynamic content or Unexpected type !== "string"`;

		wp.innerHTML = content;


		// const div = document.createElement('div');

		// // fill wrapper
		// div.innerHTML = content;

		// // append content

		// const children = [...div.children];

		// for(let elt of children)
		// wp.appendChild(elt);

	}


	private resolveOptions(data: PmdHtmlOptions) {

		const op: PHOR = {
			type: 'link',
			wp: '',
			content: ""
		};

		let k: keyof PHOR;

		for (k in op) {

			const value = data[k] || op[k];

			switch(k) {
				case 'type':
					if(! value || (value !== "link" && value !== "html"))
					continue;

					op[k] = value;
					break;
				default:
					op[k] = value;
					break;
			}
		}

		return op;
	}


	private getContentWrapper(op: PHOR) {

		const wp = document.getElementById(op.wp);;

		return (wp && wp.getAttribute('wp') === "dync")
			? wp
			: false;
	}


	private async getContent(op: PHOR) {

		if(typeof op.content !== "string" || op.content.length <= 0)
		return false;


		return (op.type === "html")
			? op.content
			: ! (/^((https?:)?\/)?\/(.+)/.test(op.content))
				? false
				: await fetch(op.content)
						.then(res => res.status !== 200 ? "" : res.text())
						.catch(err => "");
	}

}


export default Loader;
