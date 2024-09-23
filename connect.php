<?php
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];


$conn = new mysqli('localhost','root',' ','test');
if($conn->connect_error){
    die('Connection Failed : '.$conn->connect_error);
    }else
    {
        $stmt = $conn->prepare("Insert into registration(firstName,lastName,email)
        values(?,?,?)");
        $stmt ->bind_param("sss",$firstName,$lastName,$email);
        $stmt -> execute();
        echo "Registered sucessfully...";
        $stmt ->close();
        $conn -> close();
    }
?>