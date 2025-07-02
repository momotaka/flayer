<?php
// デバッグ用エンドポイント
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// エラーを表示
error_reporting(E_ALL);
ini_set('display_errors', 1);

$debug_info = [
    'php_version' => phpversion(),
    'env_exists' => file_exists(__DIR__ . '/.env'),
    'config_exists' => file_exists(__DIR__ . '/config.php'),
];

// .envファイルをテスト読み込み
try {
    if (file_exists(__DIR__ . '/.env')) {
        $env_content = file_get_contents(__DIR__ . '/.env');
        $debug_info['env_file_size'] = strlen($env_content);
        
        // 環境変数を読み込み
        require_once __DIR__ . '/config.php';
        
        $debug_info['api_key_set'] = !empty(getenv('API_KEY')) && getenv('API_KEY') !== 'your_api_key_here';
        $debug_info['api_model'] = getenv('API_MODEL');
        $debug_info['api_endpoint'] = getenv('API_ENDPOINT');
    }
} catch (Exception $e) {
    $debug_info['error'] = $e->getMessage();
    $debug_info['error_trace'] = $e->getTraceAsString();
}

// テストPOSTリクエスト
try {
    $test_data = [
        'message' => 'テスト',
        'context' => ['test' => true]
    ];
    
    // JSONエンコード/デコードテスト
    $json = json_encode($test_data);
    $decoded = json_decode($json, true);
    $debug_info['json_test'] = ($decoded !== null);
    
} catch (Exception $e) {
    $debug_info['json_error'] = $e->getMessage();
}

// cURL拡張の確認
$debug_info['curl_enabled'] = extension_loaded('curl');
if ($debug_info['curl_enabled']) {
    $debug_info['curl_version'] = curl_version()['version'];
}

echo json_encode($debug_info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>