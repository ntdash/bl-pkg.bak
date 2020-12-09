export default {

	resolveReady: (callback: VoidFunction) => {

		if(document.readyState === "complete")
			callback();
		else
			window.addEventListener('DOMContentLoaded', () => { callback() });
	}
}
