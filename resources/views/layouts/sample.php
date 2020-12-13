<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Js - Loader</title>
	<script type="application/json"><?= json_encode(["params" => ["container" => "main","name" => "home"]]) ?></script>
	<script defer src="//w-server.tb:8081/static/js/main.js"></script>

</head>
<body>
	<div id="page">
		<main id="page-content">
			<?php include("../resources/views/pages/home.php") ?>
		</main>
	</div>
</body>
</html>
