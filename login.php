<?php header('Content-Type: text/html; charset=ISO-8859-15');   //needed to process strings with accents

    session_start();
    include_once("sql_connect.php");    // connection setup

    $_SESSION["logged_in"] = False;
    $user = addslashes($_POST["username"]);
    $raw_pass = $_POST["pass"];
    
    $result = $db->query("SELECT * FROM user WHERE username='$user'");

    if($result->num_rows == 0){
        print_r(json_encode(array("result"=>"not_found")));     // print json object with appropriate 'result'
        exit;
    }

    $user_search = $result->fetch_assoc();

    $user_id = $user_search["id"];
    $pass_query = hash_hmac(HASH_PASS, $raw_pass, $user_id);

    $real_pass = $user_search["password"];

    if(strcmp($pass_query, $real_pass) == 0){
        // determine user type
        if($user_id == ADMIN_ID)
            $type = "admin";
        else
            $type = "user";

        $success = array("result"=>"success", "id"=>$user_id, "type"=>$type, "fname"=>$user_search["firstname"], "lname"=>$user_search["lastname"], "username"=>$user);
        print_r(json_encode($success)); // print json object with success result and user info (excluding password)

        $_SESSION["logged_in"] = True;
        $_SESSION["user"] = $success;
    } else {
        print_r(json_encode(array("result"=>"password_mismatch"))); // print json object with appropriate 'result'
    }
    
?>