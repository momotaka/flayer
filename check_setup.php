<?php
// セットアップチェックスクリプト
header('Content-Type: text/plain; charset=UTF-8');

echo "=== フレイヤー セットアップチェック ===\n\n";

// PHPバージョンチェック
echo "1. PHPバージョン: " . phpversion() . "\n";
if (version_compare(phpversion(), '7.0.0', '>=')) {
    echo "   ✓ OK\n";
} else {
    echo "   ✗ PHP 7.0以上が必要です\n";
}

// 必要な拡張機能チェック
echo "\n2. 必要な拡張機能:\n";
$required_extensions = ['json', 'curl'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "   ✓ $ext: インストール済み\n";
    } else {
        echo "   ✗ $ext: 未インストール\n";
    }
}

// ファイルチェック
echo "\n3. 必要なファイル:\n";
$required_files = [
    '.env' => '.envファイル（API設定）',
    'config.php' => '設定読み込みスクリプト',
    'chat.php' => 'AIチャットAPI',
    'index.html' => 'メインページ',
    'app.js' => 'JavaScriptアプリケーション',
    'style.css' => 'スタイルシート'
];

foreach ($required_files as $file => $desc) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "   ✓ $file: $desc\n";
    } else {
        echo "   ✗ $file: $desc - 見つかりません\n";
    }
}

// .envファイルの内容チェック
echo "\n4. API設定チェック:\n";
if (file_exists(__DIR__ . '/.env')) {
    try {
        require_once __DIR__ . '/config.php';
        echo "   ✓ 設定ファイル読み込み: 成功\n";
        
        if (getenv('API_KEY') && getenv('API_KEY') !== 'your_api_key_here') {
            echo "   ✓ APIキー: 設定済み\n";
        } else {
            echo "   ✗ APIキー: 未設定（.envファイルを編集してください）\n";
        }
        
        echo "   - APIモデル: " . getenv('API_MODEL') . "\n";
        echo "   - APIエンドポイント: " . getenv('API_ENDPOINT') . "\n";
    } catch (Exception $e) {
        echo "   ✗ エラー: " . $e->getMessage() . "\n";
    }
} else {
    echo "   ✗ .envファイルが見つかりません\n";
    echo "   → 実行: cp .env.example .env\n";
    echo "   → その後、.envファイルを編集してAPIキーを設定してください\n";
}

echo "\n=== チェック完了 ===\n";
?>