import DomMutationObserver from "./sb/dom-mutation-observer"
import ImagesLoader from "./sb/images-loader"
import ListernerMounting from "./sb/listeners-mounting"
import PageDataExtracter from "./sb/page-data-extracter"


const repository = [

	PageDataExtracter,
	ListernerMounting,
	DomMutationObserver,
	ImagesLoader,
];


export default repository;
