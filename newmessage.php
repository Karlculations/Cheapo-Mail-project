<?php

	session_start();
	include_once("sql_connect.php");

	$sender = $_POST["sender"];
	$recipients = "|".implode("|", $_POST["recipients"])."|";
	$subject = addslashes($_POST["subject"]);
	$body = addslashes($_POST["body"]);

	$success = $db->query( "INSERT INTO message (recipient_ids, user_id, subject, body, date_sent) VALUES ('$recipients', $sender, '$subject', '$body', NOW())");

	if($success)
		echo "success";
	else
		echo "failure";

?>