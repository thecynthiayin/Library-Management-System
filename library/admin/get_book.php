<?php 
require_once("includes/config.php");
if(!empty($_POST["bookid"])) {
  $bookid=$_POST["bookid"];
 
    $sql ="SELECT 
           tblbooks.BookName, 
           tblbooks.id,
           CASE 
               WHEN tblissuedbookdetails.id IS NULL THEN 'Available'
               ELSE 'Not Available (Currently Issued)'
           END as status
           FROM tblbooks 
           LEFT JOIN tblissuedbookdetails ON tblbooks.id = tblissuedbookdetails.BookId 
           AND tblissuedbookdetails.RetrunStatus IS NULL
           WHERE tblbooks.ISBNNumber=:bookid";
$query= $dbh -> prepare($sql);
$query-> bindParam(':bookid', $bookid, PDO::PARAM_STR);
$query-> execute();
$results = $query -> fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query -> rowCount() > 0)
{
  echo '<select class="form-control" name="bookdetails" id="get_book_name" required="required">';
  echo '<option value="">Select Book</option>';
  foreach ($results as $result) {
    if($result->status == 'Available') {
      echo '<option value="'.htmlentities($result->id).'" style="color: green;">'.htmlentities($result->BookName).' - '.htmlentities($result->status).'</option>';
      echo "<script>$('#submit').prop('disabled',false);</script>";
    } else {
      echo '<option value="" disabled style="color: red;">'.htmlentities($result->BookName).' - '.htmlentities($result->status).'</option>';
      echo "<script>$('#submit').prop('disabled',true);</script>";
    }
  }
  echo '</select>';
  echo '<div id="bookAvailabilityStatus" class="mt-2">';
  if($result->status != 'Available') {
    echo '<span class="alert alert-danger" style="display: block; margin-top: 10px;">This book is currently issued to another student.</span>';
  } else {
    echo '<span class="alert alert-success" style="display: block; margin-top: 10px;">Book is available for issuing!</span>';
  }
  echo '</div>';
}
else {
  echo '<select class="form-control" name="bookdetails" id="get_book_name">';
  echo '<option value="">Invalid ISBN Number - No Book Found</option>';
  echo '</select>';
  echo '<span class="alert alert-danger" style="display: block; margin-top: 10px;">No book found with this ISBN number.</span>';
  echo "<script>$('#submit').prop('disabled',true);</script>";
}
}
?>
