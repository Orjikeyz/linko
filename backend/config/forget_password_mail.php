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
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}


// ---------- READ JSON BODY ----------
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$name  = trim($data["name"] ?? "User");
$link  = trim($data["link"] ?? "");


// ---------- VALIDATE ----------
if (!$email || !$link) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);

    exit;
}


// ---------- EMAIL ----------
$subject = "Reset Your Linko.ng Password";

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

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">

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

<div style="font-size:34px;font-weight:bold;color:#111;">
Reset Your Password
</div>


<p style="margin-top:25px;font-size:16px;color:#666;line-height:28px;">
Hello <strong>{$name}</strong>,
</p>


<p style="font-size:16px;color:#666;line-height:28px;">
We received a request to reset the password for your
<strong>Linko.ng</strong> account.
</p>


<p style="font-size:16px;color:#666;line-height:28px;">
Click the button below to create a new password.
</p>


<!-- BUTTON -->

<div style="text-align:center;margin:45px 0;">

<a href="{$link}"
style="background:#111;color:#fff;text-decoration:none;padding:18px 42px;display:inline-block;border-radius:10px;font-size:15px;font-weight:bold;letter-spacing:1px;">
RESET PASSWORD
</a>

</div>


<hr style="border:none;border-top:1px solid #ececec;">


<!-- FALLBACK LINK -->

<p style="font-size:13px;color:#888;margin-top:30px;">
If the button doesn't work, copy and paste the link below into your browser:
</p>


<p style="word-break:break-all;">
<a href="{$link}" style="color:#111;">
{$link}
</a>
</p>


<!-- EXPIRATION -->

<p style="font-size:13px;color:#888;line-height:24px;margin-top:35px;">
For your security, this password reset link will expire after
<strong>15 minutes</strong>.
</p>


<!-- SECURITY NOTICE -->

<p style="font-size:13px;color:#999;line-height:24px;margin-top:25px;">
If you didn't request a password reset, you can safely ignore this email.
Your password will not be changed.
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
$headers .= "From: Linko.ng <info@codeph.ng >\r\n";
$headers .= "Reply-To: info@codeph.ng \r\n";
$headers .= "X-Mailer: PHP/" . phpversion();


// ---------- SEND EMAIL ----------

if (mail($email, $subject, $message, $headers)) {

    echo json_encode([
        "success" => true,
        "message" => "Password reset email sent."
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to send email."
    ]);
}
?>
