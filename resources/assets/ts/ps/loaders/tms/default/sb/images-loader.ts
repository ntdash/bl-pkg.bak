function error(elt: Element) {
	const src = elt.getAttribute('data-src');

	const msg = src ? `Failed to load an image with the [src: ${src}]...` : "Image Src Not Found !";

	if(env.debug)
	console.error(elt, msg);
}


function loadImage(elt: Element) {

	if(! (elt instanceof HTMLImageElement))
	return;

	const [params, attr] =
	[
		nt.data.params,
		elt.getAttribute('data-src')
	];

	if(! attr || attr === "")
	return;

	const process = (src: any) => {

		if (typeof src !== "string")
			return error(elt);

		const Img = new Image;
		Img.addEventListener('load', () => { elt.src = src; });
		Img.src = src;
	}


	if(/^(https?:)?\/\//.test(attr))
		process(attr);
	else
	{
		let filename = "";

		if(attr.indexOf('g/') !== 0)
		filename = `hs/${params.container}/${params.pagename}/${attr}`;

		import( /* webpackMode: "lazy-once" */ `images/${attr}`)
		.then(({default: src}) => process(src))
		.catch(() => error(elt));
	}
}


function callback () {

	document.querySelectorAll(`[data-src]`)
	.forEach(elt  => loadImage(elt));
}



const tms: Tms =  {

	label: "images_loader",
	depend_on: ['page_data_extracter'],
    priority: 3,
    observe: {
        cond: (elt) => elt instanceof HTMLImageElement && elt.hasAttribute('data-src'),
        callback: loadImage
	},
	callback
}


export default tms;
