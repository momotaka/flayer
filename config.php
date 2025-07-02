<?php
// .envファイルから環境変数を読み込む
function loadEnv($path = '.env') {
    if (!file_exists($path)) {
        throw new Exception('.envファイルが見つかりません。.env.exampleをコピーして.envを作成してください。');
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

// 環境変数を読み込む
try {
    loadEnv();
} catch (Exception $e) {
    die(json_encode(['error' => $e->getMessage()]));
}

// API設定を取得
$config = [
    'api_key' => getenv('API_KEY'),
    'api_model' => getenv('API_MODEL'),
    'api_endpoint' => getenv('API_ENDPOINT')
];

// 設定の検証
if (!$config['api_key'] || $config['api_key'] === 'your_api_key_here') {
    die(json_encode(['error' => 'APIキーが設定されていません。.envファイルを確認してください。']));
}

return $config;