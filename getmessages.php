<?php

	session_start();
	include_once("sql_connect.php");
	$id = $_POST["id"];

	// get messages for specified recipient
	$result = $db->query("SELECT * FROM message WHERE recipient_ids LIKE \"%|$id|%\" ORDER BY date_sent DESC LIMIT 10");

	$messages = array();

	// populate array
	while($row = $result->fetch_assoc()){
		$messages[$row["id"]] = $row;
	}

	// get messages read by specified recipient
	$result = $db->query("SELECT message_id, date FROM message_read WHERE reader_id=$id");

	// add read field to array
	while($row = $result->fetch_assoc()){
		$messages[$row["message_id"]]["read_at"] = $row["date"];
	}

	print_r(json_encode($messages));

?>
