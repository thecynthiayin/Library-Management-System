<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php'); // Ensure database connection is included

if (strlen($_SESSION['login']) == 0) {
    header('location:index.php');
    exit;
}

if (!isset($_SESSION['fine_id'])) {
    $_SESSION['error'] = "Fine ID is not set.";
    header('location:issued-books.php');
    exit;
}

$fine_id = $_SESSION['fine_id'];

try {
    $sql = "SELECT tblissuedbookdetails.fine, tblbooks.BookName
            FROM tblissuedbookdetails
            JOIN tblbooks ON tblissuedbookdetails.BookId = tblbooks.id
            WHERE tblissuedbookdetails.id = :fine_id";
    $query = $dbh->prepare($sql);
    $query->bindParam(':fine_id', $fine_id, PDO::PARAM_INT);
    $query->execute();
    $fineDetails = $query->fetch(PDO::FETCH_ASSOC);

    if (!$fineDetails) {
        $_SESSION['error'] = "Invalid Fine ID.";
        header('location:issued-books.php');
        exit;
    }

    $fineAmount = $fineDetails['fine'];
    $bookName = $fineDetails['BookName'];

} catch (PDOException $e) {
    $_SESSION['error'] = "Database error: " . $e->getMessage();
    header('location:issued-books.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get form inputs
    $card_number = trim($_POST['card_number'] ?? '');
    $expiry = trim($_POST['expiry'] ?? '');
    $cvc = trim($_POST['cvc'] ?? '');

    // Basic validation functions
    function validate_card_number($number) {
        return preg_match('/^\d{16}$/', $number);
    }

    function validate_expiry($expiry) {
        // Format MM/YY
        if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $expiry)) {
            return false;
        }
        // Check if expiry is not in the past
        $parts = explode('/', $expiry);
        $month = (int)$parts[0];
        $year = (int)$parts[1] + 2000; // assume 20xx

        $currentYear = (int)date('Y');
        $currentMonth = (int)date('m');

        if ($year < $currentYear) return false;
        if ($year === $currentYear && $month < $currentMonth) return false;

        return true;
    }

    function validate_cvc($cvc) {
        return preg_match('/^\d{3}$/', $cvc);
    }

    if (!validate_card_number($card_number)) {
        $_SESSION['error'] = "Invalid card number. Must be exactly 16 digits.";
        header('location:issued-books.php');
        exit;
    }

    if (!validate_expiry($expiry)) {
        $_SESSION['error'] = "Invalid expiry date. Use MM/YY format and ensure it's not expired.";
        header('location:issued-books.php');
        exit;
    }

    if (!validate_cvc($cvc)) {
        $_SESSION['error'] = "Invalid CVC. Must be exactly 3 digits.";
        header('location:issued-books.php');
        exit;
    }

    // Simulate payment success or failure randomly
    $payment_success = (bool)random_int(0,1);

    if ($payment_success) {
        // Update DB to clear fine
        $update_sql = "UPDATE tblissuedbookdetails SET fine=0 WHERE id=:fine_id";
        $update_query = $dbh->prepare($update_sql);
        $update_query->bindParam(':fine_id', $fine_id, PDO::PARAM_INT);
        $update_query->execute();

        unset($_SESSION['fine_id']);

        $_SESSION['msg'] = "Payment successful! You paid " . number_format($fineAmount, 2) . " THB for Book: " . htmlentities($bookName);
        header('location:issued-books.php');
        exit;
    } else {
        $_SESSION['error'] = "Payment unsuccessful. Please try again.";
        header('location:issued-books.php');
        exit;
    }
} else {
    // Display form
    ?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Book Nook Library Management System | Pay Your Fine</title>
        <link href="assets/css/bootstrap.css" rel="stylesheet" />
        <link href="assets/css/font-awesome.css" rel="stylesheet" />
        <link href="assets/css/style.css" rel="stylesheet" />
        <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css' />
        <style>
            .error-message {
                color: red;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }
            .form-group {
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <?php include('includes/header.php');?>
        <div class="content-wrapper">
            <div class="container">
                <div class="row pad-botm">
                    <div class="col-md-12">
                        <h4 class="header-line">PAY YOUR FINE</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                Payment Details
                            </div>
                            <div class="panel-body">
                                <p>Book: <strong><?php echo htmlentities($bookName); ?></strong></p>
                                <p>Fine Amount: <strong><?php echo number_format($fineAmount, 2); ?> THB</strong></p>
                                <form method="post" action="" id="paymentForm">
                                    <div class="form-group">
                                        <label for="card_number">Card Number (16 digits)</label>
                                        <input type="text" class="form-control" id="card_number" name="card_number" maxlength="16" required placeholder="1234123412341234">
                                        <div class="error-message" id="card_number_error"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="expiry">Expiry Date (MM/YY)</label>
                                        <input type="text" class="form-control" id="expiry" name="expiry" maxlength="5" required placeholder="MM/YY">
                                        <div class="error-message" id="expiry_error"></div>
                                        <p class="help-block">Format: MM/YY (e.g., 12/25)</p>
                                    </div>
                                    <div class="form-group">
                                        <label for="cvc">CVC (3 digits)</label>
                                        <input type="text" class="form-control" id="cvc" name="cvc" maxlength="3" required placeholder="123">
                                        <div class="error-message" id="cvc_error"></div>
                                    </div>
                                    <button type="submit" class="btn btn-success btn-block" id="payButton">Pay <?php echo number_format($fineAmount, 2); ?> THB</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include('includes/footer.php');?>
        <script src="assets/js/jquery-1.10.2.js"></script>
        <script src="assets/js/bootstrap.js"></script>
        <script src="assets/js/custom.js"></script>
        <script>
            $(document).ready(function() {
                // Format card number input
                $('#card_number').on('input', function() {
                    this.value = this.value.replace(/[^0-9]/g, '');
                });

                // Format expiry date input
                $('#expiry').on('input', function() {
                    let value = this.value.replace(/[^0-9]/g, '');
                    if (value.length > 2) {
                        value = value.substr(0, 2) + '/' + value.substr(2);
                    }
                    this.value = value;
                });

                // Format CVC input
                $('#cvc').on('input', function() {
                    this.value = this.value.replace(/[^0-9]/g, '');
                });

                // Form validation
                $('#paymentForm').on('submit', function(e) {
                    e.preventDefault();
                    let isValid = true;

                    // Reset error messages
                    $('.error-message').hide();

                    // Validate card number
                    const cardNumber = $('#card_number').val();
                    if (!/^\d{16}$/.test(cardNumber)) {
                        $('#card_number_error').text('Please enter a valid 16-digit card number').show();
                        isValid = false;
                    }

                    // Validate expiry date
                    const expiry = $('#expiry').val();
                    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                        $('#expiry_error').text('Please enter a valid expiry date (MM/YY)').show();
                        isValid = false;
                    } else {
                        // Check if date is not in the past
                        const [month, year] = expiry.split('/');
                        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                        const now = new Date();
                        if (expiryDate < now) {
                            $('#expiry_error').text('Card has expired').show();
                            isValid = false;
                        }
                    }

                    // Validate CVC
                    const cvc = $('#cvc').val();
                    if (!/^\d{3}$/.test(cvc)) {
                        $('#cvc_error').text('Please enter a valid 3-digit CVC').show();
                        isValid = false;
                    }

                    if (isValid) {
                        // Disable the submit button to prevent double submission
                        $('#payButton').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Processing...');
                        // Submit the form
                        this.submit();
                    }
                });
            });
        </script>
    </body>
    </html>
    <?php
}
?>