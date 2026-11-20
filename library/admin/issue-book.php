<?php
session_start();
error_reporting(0);
include('includes/config.php');
if(strlen($_SESSION['alogin'])==0)
    {   
header('location:index.php');
}
else{ 

if(isset($_POST['issue']))
{
$studentid=strtoupper($_POST['studentid']);
$bookid=$_POST['bookdetails'];

// Check if book is already issued
$sql_check = "SELECT id FROM tblissuedbookdetails WHERE BookId=:bookid AND RetrunStatus IS NULL";
$query_check = $dbh->prepare($sql_check);
$query_check->bindParam(':bookid', $bookid, PDO::PARAM_STR);
$query_check->execute();

if($query_check->rowCount() > 0) {
    $_SESSION['error']="This book is already issued to another student and not yet returned.";
    header('location:manage-issued-books.php');
    exit();
}

$sql="INSERT INTO  tblissuedbookdetails(StudentID,BookId) VALUES(:studentid,:bookid)";
$query = $dbh->prepare($sql);
$query->bindParam(':studentid',$studentid,PDO::PARAM_STR);
$query->bindParam(':bookid',$bookid,PDO::PARAM_STR);
$query->execute();
$lastInsertId = $dbh->lastInsertId();
if($lastInsertId)
{
$_SESSION['msg']="Book issued successfully";
header('location:manage-issued-books.php');
}
else 
{
$_SESSION['error']="Something went wrong. Please try again";
header('location:manage-issued-books.php');
}

}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Book Nook Library Management System | Issue a new Book</title>
    <!-- BOOTSTRAP CORE STYLE  -->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />
    <!-- FONT AWESOME STYLE  -->
    <link href="assets/css/font-awesome.css" rel="stylesheet" />
    <!-- CUSTOM STYLE  -->
    <link href="assets/css/style.css" rel="stylesheet" />
    <!-- GOOGLE FONT -->
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
<script>
// function for get student name
function getstudent() {
    $("#loaderIcon").show();
    jQuery.ajax({
        url: "get_student.php",
        data:'studentid='+$("#studentid").val(),
        type: "POST",
        success:function(data){
            $("#get_student_name").html(data);
            $("#loaderIcon").hide();
        },
        error:function (){}
    });
}

//function for book details
function getbook() {
    $("#loading").show();
    $("#get_book_name").hide();
    jQuery.ajax({
        url: "get_book.php",
        data:'bookid='+$("#bookid").val(),
        type: "POST",
        success:function(data){
            $("#get_book_name").html(data);
            $("#get_book_name").show();
            $("#loading").hide();
        },
        error:function (){
            $("#loading").hide();
            $("#get_book_name").show();
        }
    });
}

</script> 
<style type="text/css">
  .others{
    color:red;
}

</style>


</head>
<body>
      <!------MENU SECTION START-->
<?php include('includes/header.php');?>
<!-- MENU SECTION END-->
    <div class="content-wra
    <div class="content-wrapper">
         <div class="container">
        <div class="row pad-botm">
            <div class="col-md-12">
                <h4 class="header-line">Issue a New Book</h4>
                
                            </div>

</div>
<div class="row">
<div class="col-md-10 col-sm-6 col-xs-12 col-md-offset-1"">
<div class="panel panel-info">
<div class="panel-heading">
Issue a New Book
</div>
<div class="panel-body">
<form role="form" method="post">

<div class="form-group">
<label>Student ID<span style="color:red;">*</span></label>
<input class="form-control" type="text" name="studentid" id="studentid" onBlur="getstudent()" autocomplete="off" required />
</div>

<div class="form-group">
<span id="get_student_name" style="font-size:16px;"></span> 
</div>

<div class="form-group">
<label>ISBN Number or Book Title<span style="color:red;">*</span></label>
<input class="form-control" type="text" name="bookid" id="bookid" onBlur="getbook()" required="required" />
<small class="form-text text-muted">Enter the ISBN number to check book availability</small>
</div>

<div class="form-group">
<label>Available Books</label>
<div id="get_book_name">
   <select class="form-control">
       <option value="">First enter ISBN number</option>
   </select>
</div>
<div id="loading" style="display:none;">
    <img src="assets/img/loading.gif" alt="Loading..." /> Checking book availability...
</div>
</div>

<button type="submit" name="issue" id="submit" class="btn btn-info" disabled>Issue Book</button>

                                    </form>
                            </div>
                        </div>
                            </div>

        </div>
   
    </div>
    </div>
     <!-- CONTENT-WRAPPER SECTION END-->
  <?php include('includes/footer.php');?>
      <!-- FOOTER SECTION END-->
    <!-- JAVASCRIPT FILES PLACED AT THE BOTTOM TO REDUCE THE LOADING TIME  -->
    <!-- CORE JQUERY  -->
    <script src="assets/js/jquery-1.10.2.js"></script>
    <!-- BOOTSTRAP SCRIPTS  -->
    <script src="assets/js/bootstrap.js"></script>
      <!-- CUSTOM SCRIPTS  -->
    <script src="assets/js/custom.js"></script>

</body>
</html>
<?php } ?>
