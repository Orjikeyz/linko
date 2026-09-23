<?php

header("Content-Type: application/json");

// ---------- ERROR REPORTING ----------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// ---------- ALLOWED ORIGINS ----------
$allowed_origins = [
    "https://linko-ng.vercel.app",
    "https://linko-mosc.onrender.com"
];


// ---------- HEADERS ----------
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}


// ---------- HANDLE PREFLIGHT ----------
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


// ---------- READ JSON BODY ----------
$data = json_decode(file_get_contents("php://input"), true);

$email         = trim($data["email"] ?? "");
$name          = trim($data["name"] ?? "Customer");
$plan          = trim($data["plan"] ?? "");
$amount        = trim($data["amount"] ?? "");
$currency      = trim($data["currency"] ?? "NGN");
$billing_cycle = trim($data["billing_cycle"] ?? "");
$reference     = trim($data["reference"] ?? "");
$payment_date  = trim($data["payment_date"] ?? date("F j, Y"));
$next_billing  = trim($data["next_billing"] ?? "");


// ---------- VALIDATE ----------
if (!$email || !$plan || !$amount || !$reference) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Missing required payment fields."
    ]);

    exit;
}


// ---------- FORMAT AMOUNT ----------
$formatted_amount = number_format((float)$amount, 2);


// ---------- SUBJECT ----------
$subject = "Subscription Payment Successful - Linko.ng";


// ---------- EMAIL ----------
$message = <<<HTML
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="margin:0;padding:40px;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">

<!-- HEADER -->

<tr>
<td style="background:#0a0a0a;padding:45px;text-align:center;">

<div style="color:#ffffff;font-size:34px;font-weight:bold;letter-spacing:6px;">
LINKO.NG
</div>

<div style="color:#bdbdbd;font-size:13px;margin-top:12px;letter-spacing:3px;">
VENDOR PORTAL
</div>

</td>
</tr>


<!-- CONTENT -->

<tr>
<td style="padding:55px;">

<div style="text-align:center;margin-bottom:35px;">

<div style="
width:64px;
height:64px;
background:#111;
border-radius:50%;
margin:0 auto 20px auto;
color:#fff;
font-size:32px;
line-height:64px;
">
✓
</div>

<div style="font-size:32px;font-weight:bold;color:#111;">
Payment Successful
</div>

<p style="font-size:15px;color:#777;line-height:25px;margin-top:15px;">
Your Linko.ng subscription has been activated successfully.
</p>

</div>


<p style="font-size:16px;color:#555;line-height:28px;">
Hello <strong>{$name}</strong>,
</p>

<p style="font-size:16px;color:#666;line-height:28px;">
Thank you for subscribing to <strong>Linko.ng</strong>.
Your payment has been successfully received and your subscription is now active.
</p>


<!-- PAYMENT SUMMARY -->

<table width="100%" cellpadding="0" cellspacing="0"
style="margin-top:35px;border:1px solid #e8e8e8;border-radius:10px;">

<tr>
<td colspan="2"
style="background:#fafafa;padding:18px;font-size:15px;font-weight:bold;color:#111;">
Payment Summary
</td>
</tr>

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Plan
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:14px;font-weight:bold;border-top:1px solid #eee;">
{$plan}
</td>
</tr>

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Amount
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:14px;font-weight:bold;border-top:1px solid #eee;">
{$currency} {$formatted_amount}
</td>
</tr>

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Billing Cycle
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:14px;font-weight:bold;border-top:1px solid #eee;">
{$billing_cycle}
</td>
</tr>

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Payment Date
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:14px;font-weight:bold;border-top:1px solid #eee;">
{$payment_date}
</td>
</tr>

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Transaction Reference
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:13px;font-weight:bold;border-top:1px solid #eee;word-break:break-all;">
{$reference}
</td>
</tr>

HTML;

if ($next_billing) {
    $message .= <<<HTML

<tr>
<td style="padding:15px 18px;color:#777;font-size:14px;border-top:1px solid #eee;">
Next Billing Date
</td>

<td align="right"
style="padding:15px 18px;color:#111;font-size:14px;font-weight:bold;border-top:1px solid #eee;">
{$next_billing}
</td>
</tr>

HTML;
}

$message .= <<<HTML

</table>


<!-- SUCCESS NOTICE -->

<div style="
margin-top:35px;
padding:20px;
background:#f7f7f7;
border-radius:10px;
">

<p style="margin:0;font-size:14px;color:#666;line-height:24px;">
<strong style="color:#111;">Your subscription is active.</strong>
</p>

<p style="margin:8px 0 0 0;font-size:13px;color:#888;line-height:22px;">
You can now continue using your Linko.ng vendor account and enjoy the features included in your plan.
</p>

</div>


<p style="font-size:13px;color:#999;line-height:24px;margin-top:30px;">
Please keep this email for your records. If you did not authorize this payment,
please contact Linko.ng support immediately.
</p>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td style="background:#fafafa;padding:30px;text-align:center;">

<div style="font-size:12px;color:#888;">
© {date("Y")} Linko.ng. All Rights Reserved.
</div>

<div style="margin-top:8px;font-size:11px;color:#b5b5b5;">
Secure Vendor Platform
</div>

</td>
</tr>


</table>

</td>
</tr>
</table>

</body>
</html>
HTML;


// ---------- EMAIL HEADERS ----------

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Linko.ng <info@codeph.ng>\r\n";
$headers .= "Reply-To: info@codeph.ng\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();


// ---------- SEND EMAIL ----------

$additional_params = '-finfo@codeph.ng';

if (mail($email, $subject, $message, $headers, $additional_params)) {

    echo json_encode([
        "success" => true,
        "message" => "Subscription payment email sent."
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to send subscription payment email."
    ]);
}
?>
