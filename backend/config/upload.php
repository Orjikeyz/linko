<?php

// ============================================================
// ERROR REPORTING
// ============================================================

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);


// ============================================================
// ALLOWED DOMAINS
// ============================================================

$allowedOrigins = [
    "https://linko-ng.vercel.app",
    "https://linko-mosc.onrender.com",
    "http://localhost"
];


// ============================================================
// CHECK REQUEST ORIGIN
// ============================================================

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!in_array($origin, $allowedOrigins, true)) {

    http_response_code(403);

    header('Content-Type: application/json');

    echo json_encode([
        'status' => false,
        'message' => 'Access denied'
    ]);

    exit;
}


// ============================================================
// CORS HEADERS
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');


// ============================================================
// HANDLE CORS PREFLIGHT
// ============================================================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(204);

    exit;
}


// ============================================================
// METHOD CHECK
// ============================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'status' => false,
        'message' => 'Only POST requests are allowed'
    ]);

    exit;
}


// ============================================================
// CONFIGURATION
// ============================================================

$uploadDir = __DIR__ . '/uploads/images/';

$baseUrl = 'https://cloudstorage.codeph.ng/linkostorage/uploads/images/';

$maxSize = 5 * 1024 * 1024; // 5MB per image


// ============================================================
// ALLOWED IMAGE TYPES
// ============================================================

$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif'
];


// ============================================================
// ENSURE UPLOAD DIRECTORY EXISTS
// ============================================================

if (!is_dir($uploadDir)) {

    if (!mkdir($uploadDir, 0755, true)) {

        http_response_code(500);

        echo json_encode([
            'status' => false,
            'message' => 'Failed to create upload directory'
        ]);

        exit;
    }
}


// ============================================================
// CHECK FILES
// ============================================================

if (!isset($_FILES['images'])) {

    http_response_code(400);

    echo json_encode([
        'status' => false,
        'message' => 'No files sent'
    ]);

    exit;
}


// ============================================================
// NORMALIZE FILE ARRAY
// ============================================================

if (is_array($_FILES['images']['name'])) {

    $files = $_FILES['images'];

} else {

    $files = [
        'name' => [
            $_FILES['images']['name']
        ],

        'type' => [
            $_FILES['images']['type']
        ],

        'tmp_name' => [
            $_FILES['images']['tmp_name']
        ],

        'error' => [
            $_FILES['images']['error']
        ],

        'size' => [
            $_FILES['images']['size']
        ]
    ];
}


// ============================================================
// RESULTS
// ============================================================

$responseUrls = [];

$errors = [];


// ============================================================
// MIME DETECTOR
// ============================================================

$finfo = new finfo(FILEINFO_MIME_TYPE);


// ============================================================
// LOOP THROUGH FILES
// ============================================================

for ($i = 0; $i < count($files['name']); $i++) {

    $originalName = $files['name'][$i];

    $tmp = $files['tmp_name'][$i];

    $size = (int) $files['size'][$i];

    $error = $files['error'][$i];


    // --------------------------------------------------------
    // UPLOAD ERROR
    // --------------------------------------------------------

    if ($error !== UPLOAD_ERR_OK) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'Upload failed',
            'error_code' => $error
        ];

        continue;
    }


    // --------------------------------------------------------
    // VERIFY ACTUAL UPLOADED FILE
    // --------------------------------------------------------

    if (!is_uploaded_file($tmp)) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'Invalid uploaded file'
        ];

        continue;
    }


    // --------------------------------------------------------
    // FILE SIZE CHECK
    // --------------------------------------------------------

    if ($size <= 0 || $size > $maxSize) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'File must be between 1 byte and 5MB'
        ];

        continue;
    }


    // --------------------------------------------------------
    // DETECT MIME TYPE FROM FILE CONTENT
    // --------------------------------------------------------

    $mime = $finfo->file($tmp);

    if (!isset($allowedMimeTypes[$mime])) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'Invalid image type'
        ];

        continue;
    }


    // --------------------------------------------------------
    // VERIFY THAT IT IS ACTUALLY AN IMAGE
    // --------------------------------------------------------

    $imageInfo = @getimagesize($tmp);

    if ($imageInfo === false) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'Invalid image file'
        ];

        continue;
    }


    // --------------------------------------------------------
    // GET EXTENSION FROM VERIFIED MIME TYPE
    // --------------------------------------------------------

    $extension = $allowedMimeTypes[$mime];


    // --------------------------------------------------------
    // GENERATE RANDOM FILE NAME
    // --------------------------------------------------------

    try {

        $filename = bin2hex(random_bytes(16)) . '.' . $extension;

    } catch (Throwable $e) {

        http_response_code(500);

        echo json_encode([
            'status' => false,
            'message' => 'Failed to generate filename'
        ]);

        exit;
    }


    // --------------------------------------------------------
    // DESTINATION
    // --------------------------------------------------------

    $destination = $uploadDir . $filename;


    // --------------------------------------------------------
    // MOVE UPLOADED FILE
    // --------------------------------------------------------

    if (!move_uploaded_file($tmp, $destination)) {

        $errors[] = [
            'file' => $originalName,
            'message' => 'Failed to save uploaded file'
        ];

        continue;
    }


    // --------------------------------------------------------
    // FILE PERMISSIONS
    // --------------------------------------------------------

    @chmod($destination, 0644);


    // --------------------------------------------------------
    // ADD URL TO RESPONSE
    // --------------------------------------------------------

    $responseUrls[] = $baseUrl . $filename;
}


// ============================================================
// NOTHING SUCCESSFULLY UPLOADED
// ============================================================

if (empty($responseUrls)) {

    http_response_code(400);

    echo json_encode([
        'status' => false,
        'message' => 'No valid files were uploaded',
        'errors' => $errors
    ]);

    exit;
}


// ============================================================
// SUCCESS
// ============================================================

echo json_encode([
    'status' => true,
    'count' => count($responseUrls),
    'urls' => $responseUrls,
    'errors' => $errors
]);

?>