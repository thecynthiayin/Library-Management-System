<?php
session_start();
include('includes/config.php'); // Include your database connection

if (strlen($_SESSION['login']) == 0) {
    header('location:index.php');
    exit;
}

if (isset($_GET['fine_id'])) {
    $_SESSION['fine_id'] = $_GET['fine_id'];
    header('location:payment.php'); // Redirect to the payment page
    exit;
} else {
    $_SESSION['error'] = "Fine ID is missing.";
    header('location:issued-books.php'); // Or wherever you want to handle this error
    exit;
}
?>