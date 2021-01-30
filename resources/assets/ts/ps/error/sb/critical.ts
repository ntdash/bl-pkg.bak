export default class CriticalError extends Error
{

	#default = `<div class="error critical-error"><p class="error-msg"><span>A Critical Error Occurred! May you attempt accessing this page later ? Thanks !</span></p></div>`;

	constructor(msg: {doc ?: string, log ?: string})
	{
		super(msg.log);

		const tpl = this.template(msg.doc);
		this.dispatchError(tpl);
	}

	dispatchError(tpl: string)
	{
		const body = document.body;

		for(let attr in body.attributes)
			if(attr !== "wrapper") body.removeAttribute(attr);

		body.innerHTML = tpl;
	}

	template(msg ?: string)
	{
		const div = ( ! msg) ? this.#default : `<div class="error critical-error"><p class="error-msg">${ msg }</p></div>`;
		return div;
	}
}
