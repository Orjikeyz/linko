<?php
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

// header("Content-Type: application/json");
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");

// ---------- CONFIG ----------
$uploadDir = __DIR__ . '/uploads/images/';
$baseUrl   = 'https://judydoesbraids.com/linkostorage/uploads/images/';
$maxSize   = 5 * 1024 * 1024; // 5MB per image
$allowed   = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ---------- ENSURE UPLOAD DIRECTORY EXISTS ----------
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true)) {
    http_response_code(500);
    echo json_encode(['status' => false, 'message' => 'Failed to create upload directory']);
    exit;
}

// ---------- CHECK FILES ----------
if (!isset($_FILES['images'])) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'No files sent']);
    exit;
}

// ---------- NORMALIZE SINGLE OR MULTIPLE FILES ----------
$responseUrls = [];

if (is_array($_FILES['images']['name'])) {
    $files = $_FILES['images'];
} else {
    // Single file uploaded, wrap in arrays
    $files = [
        'name'     => [$_FILES['images']['name']],
        'type'     => [$_FILES['images']['type']],
        'tmp_name' => [$_FILES['images']['tmp_name']],
        'error'    => [$_FILES['images']['error']],
        'size'     => [$_FILES['images']['size']]
    ];
}

// ---------- LOOP THROUGH FILES ----------
for ($i = 0; $i < count($files['name']); $i++) {

    // Skip if upload error
    if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;

    // Skip if file too big
    if ($files['size'][$i] > $maxSize) continue;

    $tmp  = $files['tmp_name'][$i];
    $mime = mime_content_type($tmp);

    // Skip if invalid mime type
    if (!in_array($mime, $allowed)) continue;

    // Generate secure random filename
    $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
    try {
        $name = bin2hex(random_bytes(16)) . '.' . $ext;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => false, 'message' => 'Failed to generate filename']);
        exit;
    }

    // Move uploaded file to final destination
    if (move_uploaded_file($tmp, $uploadDir . $name)) {
        $responseUrls[] = $baseUrl . $name;
    }
}

// ---------- RESPONSE ----------
if (empty($responseUrls)) {
    http_response_code(400);
    echo json_encode(['status' => false, 'message' => 'No valid files were uploaded']);
    exit;
}

echo json_encode([
    'status' => true,
    'count'  => count($responseUrls),
    'urls'   => $responseUrls
]);
