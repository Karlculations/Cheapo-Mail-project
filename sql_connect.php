<?php

define("SERVER", "localhost");
define("USER", "root");
define("PASS", "enterplzkthx");
define("DATABASE", "cheapomail");
define("ADMIN_ID", 1);
define("HASH_PASS", "md5");

$db = new mysqli(SERVER, USER, PASS, DATABASE);

if($db->connect_error)
	die("Connection failed ".$db->connection_error); 

?>