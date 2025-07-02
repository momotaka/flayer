<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 設定を読み込む
$config = require_once 'config.php';

// POSTデータを取得
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['message']) || !isset($input['context'])) {
    http_response_code(400);
    echo json_encode(['error' => 'メッセージとコンテキストが必要です']);
    exit;
}

$userMessage = $input['message'];
$context = $input['context'];

// システムプロンプトを作成
$systemPrompt = "あなたは優秀なチラシ作成アシスタントです。ユーザーがチラシを作成するために必要な情報を丁寧に聞き出し、適切なアドバイスを提供します。

現在の進行状況：
" . json_encode($context, JSON_UNESCAPED_UNICODE) . "

重要な指示：
1. ユーザーの回答から要点を抽出し、整理して理解する
2. 単語のみの回答でも文脈から意図を読み取る（例：「申込」→「申込を増やしたい」、「主婦」→「主婦層がターゲット」）
3. 曖昧な表現や口語的な回答も適切に解釈し、プロフェッショナルな内容に整理する
4. 「分からない」「迷っている」という回答には、具体例を3つ以上提示する
5. 回答が不明確な場合は、優しく追加の質問をして詳細を引き出す
6. 各回答を受け取ったら、理解した内容を簡潔に要約して確認する（例：「申込を増やしたいということですね」）
7. 短い回答には肯定的に反応し、必要に応じて詳細を聞く
8. すべての質問への回答が集まったら、以下の構成で魅力的なチラシ案を作成する：
   - キャッチコピー（ターゲットの心に響く一言）
   - 課題提起（ターゲットの悩みに共感）
   - 解決策の提示（商品・サービスの価値）
   - 信頼性の証明（実績・お客様の声）
   - 行動喚起（明確なCTA）
9. ユーザーの回答の本質を理解し、プロのマーケターとして最適な提案をする";

// APIリクエストを準備
$messages = [
    ['role' => 'system', 'content' => $systemPrompt],
    ['role' => 'user', 'content' => $userMessage]
];

// OpenAI API形式でリクエスト
if (strpos($config['api_endpoint'], 'openai.com') !== false) {
    $requestData = [
        'model' => $config['api_model'],
        'messages' => $messages,
        'temperature' => 0.7,
        'max_tokens' => 1000
    ];
    
    $ch = curl_init($config['api_endpoint']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $config['api_key']
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode(['error' => 'API通信エラー: ' . $response]);
        exit;
    }
    
    $responseData = json_decode($response, true);
    
    if (isset($responseData['choices'][0]['message']['content'])) {
        echo json_encode([
            'response' => $responseData['choices'][0]['message']['content']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'APIレスポンスエラー']);
    }
}
// Claude API形式
elseif (strpos($config['api_endpoint'], 'anthropic.com') !== false) {
    $requestData = [
        'model' => $config['api_model'],
        'messages' => $messages,
        'max_tokens' => 1000
    ];
    
    $ch = curl_init($config['api_endpoint']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'x-api-key: ' . $config['api_key'],
        'anthropic-version: 2023-06-01'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode(['error' => 'API通信エラー: ' . $response]);
        exit;
    }
    
    $responseData = json_decode($response, true);
    
    if (isset($responseData['content'][0]['text'])) {
        echo json_encode([
            'response' => $responseData['content'][0]['text']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'APIレスポンスエラー']);
    }
}
else {
    http_response_code(500);
    echo json_encode(['error' => '未対応のAPIエンドポイントです']);
}
?>