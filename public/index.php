<?php

header("Content-Type: text/html; charset=UTF-8");

$uri = $_SERVER['REQUEST_URI'];

if($uri == "/contact") {

	include "../resources/views/pages/contact.php";
	exit;
}
else
include "../resources/views/layouts/sample.php";
