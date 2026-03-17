<?php
/**
 * Narrative Orbit — Contact Form API
 * Secure server-side handler for quote submissions
 */

// ===== SECURITY HEADERS =====
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// ===== CORS (restrict to your domain in production) =====
$allowed_origin = 'https://narrativeorbit.com'; // Change to your domain
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === $allowed_origin || (defined('DEV_MODE') && DEV_MODE)) {
    header('Access-Control-Allow-Origin: ' . $allowed_origin);
}

// ===== METHOD CHECK =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// ===== RATE LIMITING (file-based) =====
$rate_file = sys_get_temp_dir() . '/no_rate_' . md5($_SERVER['REMOTE_ADDR']);
$rate_limit = 3;       // max submissions
$rate_window = 3600;   // per hour

$rate_data = [];
if (file_exists($rate_file)) {
    $rate_data = json_decode(file_get_contents($rate_file), true) ?: [];
}
$now = time();
$rate_data = array_filter($rate_data, fn($t) => ($now - $t) < $rate_window);
if (count($rate_data) >= $rate_limit) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
    exit;
}

// ===== PARSE INPUT =====
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    // Fallback to POST
    $data = $_POST;
}

// ===== HONEYPOT CHECK =====
if (!empty($data['_honey'])) {
    // Silently succeed to fool bots
    echo json_encode(['success' => true]);
    exit;
}

// ===== SANITIZE =====
function sanitize_input(string $str, int $max = 500): string {
    $str = trim($str);
    $str = strip_tags($str);
    $str = htmlspecialchars($str, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return mb_substr($str, 0, $max);
}

// ===== VALIDATE =====
$errors = [];

$name = sanitize_input($data['name'] ?? '', 80);
$email = sanitize_input($data['email'] ?? '', 254);
$service = sanitize_input($data['service'] ?? '', 50);
$budget = sanitize_input($data['budget'] ?? '', 50);
$message = sanitize_input($data['message'] ?? '', 1000);

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Name is required (min 2 characters).';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
$allowed_services = ['scriptwriting', 'video-editing', 'content-strategy', 'full-production', 'other'];
if (empty($service) || !in_array($service, $allowed_services, true)) {
    $errors[] = 'Please select a valid service.';
}
if (empty($message) || mb_strlen($message) < 20) {
    $errors[] = 'Message must be at least 20 characters.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// ===== STORE SUBMISSION =====
$submission = [
    'name'      => $name,
    'email'     => $email,
    'service'   => $service,
    'budget'    => $budget,
    'message'   => $message,
    'ip'        => hash('sha256', $_SERVER['REMOTE_ADDR']), // hashed for privacy
    'timestamp' => date('c'),
    'read'      => false,
];

$storage_file = __DIR__ . '/../data/submissions.json';
$storage_dir = dirname($storage_file);

if (!is_dir($storage_dir)) {
    mkdir($storage_dir, 0750, true);
}

$submissions = [];
if (file_exists($storage_file)) {
    $submissions = json_decode(file_get_contents($storage_file), true) ?: [];
}
$submissions[] = $submission;

// Keep max 500 entries
if (count($submissions) > 500) {
    $submissions = array_slice($submissions, -500);
}

file_put_contents($storage_file, json_encode($submissions, JSON_PRETTY_PRINT), LOCK_EX);

// ===== UPDATE RATE LIMIT =====
$rate_data[] = $now;
file_put_contents($rate_file, json_encode(array_values($rate_data)));

// ===== SEND EMAIL (optional — configure SMTP in production) =====
$to = 'hello@narrativeorbit.com'; // Change to your email
$subject = 'New Quote Request from ' . $name;
$body = "New quote request received:\n\n" .
    "Name: $name\n" .
    "Email: $email\n" .
    "Service: $service\n" .
    "Budget: $budget\n\n" .
    "Message:\n$message\n\n" .
    "Submitted: " . date('Y-m-d H:i:s');
$headers = "From: noreply@narrativeorbit.com\r\nReply-To: $email\r\nX-Mailer: PHP/" . phpversion();

// Uncomment to enable email:
// mail($to, $subject, $body, $headers);

// ===== RESPOND =====
echo json_encode(['success' => true, 'message' => 'Your message has been received. We\'ll be in touch within 24 hours.']);
