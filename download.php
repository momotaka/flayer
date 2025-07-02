<?php
header('Content-Type: text/plain; charset=UTF-8');
header('Content-Disposition: attachment; filename="flyer_proposal.txt"');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['content'])) {
    $content = $_POST['content'];
    
    // BOMを追加（Windows環境でのUTF-8文字化け対策）
    echo "\xEF\xBB\xBF";
    
    // チラシ案の内容を出力
    echo $content;
} else {
    http_response_code(400);
    echo "エラー: コンテンツが送信されていません。";
}
?>