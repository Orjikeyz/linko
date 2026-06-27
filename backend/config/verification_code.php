<?php
header("Content-Type: application/json");
// ---------- ERROR REPORTING ----------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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


// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$name  = trim($data["name"] ?? "Vendor");
$code  = trim($data["code"] ?? "");
$link  = trim($data["link"] ?? "");

if (!$email || !$code || !$link) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

$link = "$link?mail=$email";
$subject = "Verify your Linko.ng Account";

$message = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>

<body style="margin:0;padding:40px;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">

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

<tr>
<td style="padding:55px;">

<div style="font-size:34px;font-weight:bold;color:#111;">
Verify Your Account
</div>

<p style="margin-top:25px;font-size:16px;color:#666;line-height:28px;">
Hello <strong>{$name}</strong>,
</p>

<p style="font-size:16px;color:#666;line-height:28px;">
Thank you for registering with <strong>Linko.ng</strong>.
Use the verification code below to activate your vendor account.
</p>

<div style="margin:45px auto;width:320px;background:#111;color:#fff;padding:22px;text-align:center;font-size:42px;font-weight:bold;letter-spacing:14px;border-radius:12px;">
{$code}
</div>

<p style="font-size:15px;color:#777;line-height:28px;">
Or simply click the button below.
</p>

<div style="text-align:center;margin:45px 0;">

<a href="{$link}" style="background:#111;color:#fff;text-decoration:none;padding:18px 42px;display:inline-block;border-radius:10px;font-size:15px;font-weight:bold;letter-spacing:1px;">
VERIFY ACCOUNT
</a>

</div>

<hr style="border:none;border-top:1px solid #ececec;">

<p style="font-size:13px;color:#888;margin-top:30px;">
If the button doesn't work, copy the link below:
</p>

<p style="word-break:break-all;">
<a href="{$link}" style="color:#111;">{$link}</a>
</p>

<p style="font-size:13px;color:#999;line-height:24px;margin-top:35px;">
If you didn't create this account, you can safely ignore this email.
</p>

</td>
</tr>

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

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Linko.ng <noreply@linko.ng>\r\n";
$headers .= "Reply-To: support@linko.ng\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($email, $subject, $message, $headers)) {

    echo json_encode([
        "success" => true,
        "message" => "Verification email sent."
    ]);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to send email."
    ]);

}