<?php

	session_start();
	include_once("sql_connect.php");

	$result = $db->query("SELECT * FROM user");

	$users = array();

	while($row = $result->fetch_assoc()){
		$users[$row["id"]] = array("id"=>$row["id"], "username"=>$row["username"], "firstname"=>$row["firstname"], "lastname"=>$row["lastname"]);
	}

	print_r(json_encode($users));

?>