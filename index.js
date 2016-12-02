$(document).ready(function(){

    // check current php session on start
    $.ajax({
        url: "getsession.php",
        success: function(data){
            var session = JSON.parse(data);

            if(session.hasOwnProperty("logged_in") && session.logged_in == true){
                if(session.hasOwnProperty("user")){
                    login(session.user);
                    return;
                }
            }

            loadLoginPage();
        }
    });

    // load login page
    function loadLoginPage(){
        $.ajax({
            url: "login.html",
            success: function(page){

                $("body").html(page);
                // login page
                $("#loginForm").submit(function(e) {
                    $.ajax({
                        type: "POST",
                        url: "login.php",
                        data: $(this).serialize(), // serializes the form's elements.
                        success: function(data){
                            login(JSON.parse(data));
                        }
                    });
                    e.preventDefault(); // avoid to execute the actual submit of the form.
                });
            }
        });
    }

    function login(result){
        // check result for success
        if(result.result == "not_found"){
            $("#error").html("User does not exist");
        } else if (result.result == "password_mismatch"){
            $("#error").html("Incorrect username or password");
        } else if (result.result == "success"){
            //determine the user type
            if(result.type == "admin"){
                $.ajax({
                    url: "admin.html",
                    success: function(page){
                        loadAdminPage(result, page);
                    }
                });
            } else if (result.type == "user"){
                loadUser(result);
            }
        }
    }

    function loadAdminPage(admin, page){
        $("body").html(page);
        $("#name").html(admin.fname + " " + admin.lname);

        // logout
        $("#logout").click(function(){
            logOut();
        });


        $("#registrationForm").submit(function(e){
            $.ajax({
                type: "POST",
                url: "register.php",
                data: $(this).serialize(),
                success: function(data){
                    console.log(data);
                    // respond to errors
                    if(data == "password_mismatch"){
                        $("#error").html("Passwords must match.");
                    } else if (data == "name_taken"){
                        $("#error").html("Sorry, this username is already taken.");
                    } else if (data == "failed"){
                        $("#error").html("Something went wrong, but we're not sure what.");
                    } else if (data == "success"){
                        $("#error").html("Successfully registered.");
                    }
                }
            });
            e.preventDefault();
        });
    }

    function loadUserPage(user,page){
        $("body").html(page);
        $("#name").html(user.fname + " " + user.lname);

        // logout
        $("#logout").click(function(){
            logOut();
        });

        var users;
        // get users list
        $.ajax({
            url: "getusers.php",
            success: function(data){
                users = JSON.parse(data);
                // get messages
                getMessages(user, users)
            }
        });

        $("#compose").click(function(){
            newMessage(user, users);
        });
        
    }

    function loadUser(user){
        $.ajax({
            url: "user.html",
            success: function(page){
                loadUserPage(user, page);
            }
        });
    }

    function getMessages(user, users){
        // get messaged
        $.ajax({
            type: "POST",
            url: "getmessages.php",
            data: { id: user.id },
            success: function(data){
                $("#msglst").html("");
                var messages = JSON.parse(data);
                if(messages.length==0){
                    $("#msgHeader").html("No messages.");
                } else {
                    for(i in messages){
                        var msg = messages[i];
                        var li = $("<li id='"+i+"' class='message'>");
                        var sender = users[msg.user_id];
                        var s_name = sender.firstname + " " + sender.lastname;
                        $(li).append(s_name+" - "+msg.subject);
                        // add styles for read messages
                        if( msg.hasOwnProperty("read_at") )
                            $(li).addClass("read");
                        $("#msglst").append(li);
                    }
                }

                $(".message").each(function(){
                    $(this).click(function(){
                        var msg = messages[$(this).attr("id")];
                        if(!isRead(msg)){
                            markAsRead(msg, user);
                        }
                        getMessages(user, users);
                        showMessage(msg, users);
                    });
                });
            }
        });
    }

    function showMessage(msg, users){
        $("#msg").html("<h2>"+msg.subject+"</h2>");
        var sender = users[msg.user_id].firstname + " " + users[msg.user_id].lastname;
        $("#msg").append("<h4>"+sender+" at "+msg.date_sent+"</h4>");
        $("#msg").append("<p>"+msg.body+"</p>");
    }

    function isRead(msg){
        return msg.hasOwnProperty("read_at");
    }

    function markAsRead(msg, user){
        $.ajax({
            type: "POST",
            url: "markasread.php",
            data: { 
                    message_id: msg.id,
                    reader_id: user.id
            },
            success: function(data){
                // nothing to do
            }
        });
    }

    function newMessage(user, users){
        $.ajax({
            url: "newmessage.html",
            success: function(page){
                $("body").html(page);
                for(i in users){
                    c_user = users[i];
                    if( c_user.id != user.id && c_user.username != "admin" ){
                        $("#recipients").append("<option value=\""+c_user.id+"\">"+c_user.username+", "+c_user.firstname+" "+c_user.lastname+"</option>");
                    }
                }

                $("#cancel").click(function(){
                    loadUser(user);
                });

                $("#sender").val(user.id);

                $("#newMessageForm").submit(function(e){
                    sendMessage(this, user);
                    e.preventDefault();
                });
            }
        });
    }

    function sendMessage(form, user){
        $.ajax({
            type: "POST",
            url: "newmessage.php",
            data: $(form).serialize(),
            success: function(data){
                if(data == "success"){
                    loadUser(user);
                    alert("Message sent!");
                } else {
                    alert("Message not sent.");
                }
            }
        });
    }

    function logOut(){
        if(confirm("Are you sure you want to log out?")){
            $.ajax({
                url: "logout.php",
                success: function(data){
                    loadLoginPage();
                }
            });
        }
    }

});

