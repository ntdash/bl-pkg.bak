<h1>
	<span>Page Name: </span>
	<span> Js - Loader</span>
</h1>
<p>
	<span>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis tenetur quidem necessitatibus sit dolore debitis distinctio temporibus omnis accusamus asperiores ratione ut ad rerum, doloremque aperiam sapiente. Inventore, eum id.</span>
</p>
<button e-bind="[click]:testButton">Load Contact Partial Page</button>

<style>
	#contact-wp {

		width: 500px;
		min-height: 150px;
		padding: 1rem;
		background-color: #343a40;

		margin-top: 2rem;
		border-radius: 5px;
	}

	#contact-wp * {
		color: #fff;
	}
</style>

<div id="contact-wp" wp="dync"></div>
