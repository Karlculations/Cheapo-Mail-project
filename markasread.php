<?php

	session_start();
	include_once("sql_connect.php");

	$message_id = $_POST["message_id"];
	$reader_id = $_POST["reader_id"];

	$db->query("INSERT INTO message_read (message_id, reader_id, date) VALUES ('$message_id', '$reader_id', NOW())");

?>