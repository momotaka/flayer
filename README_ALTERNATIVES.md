# Flayer - AI API代替案

OpenAI APIの利用制限に達した場合の代替案です。

## 1. Google Gemini API（無料枠あり）

### セットアップ
1. [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーを取得
2. `.env`ファイルを編集：
```env
API_KEY=your_gemini_api_key_here
API_MODEL=gemini-pro
API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### chat.phpの修正が必要
Gemini APIは異なるフォーマットを使用するため、追加の実装が必要です。

## 2. Anthropic Claude API

### セットアップ
1. [Anthropic Console](https://console.anthropic.com/)でAPIキーを取得
2. `.env`ファイルを編集：
```env
API_KEY=your_claude_api_key_here
API_MODEL=claude-3-haiku-20240307
API_ENDPOINT=https://api.anthropic.com/v1/messages
```

※ chat.phpはすでにClaude APIに対応しています。

## 3. ローカルLLM（無料）

### Ollama を使用
1. [Ollama](https://ollama.ai/)をインストール
2. モデルをダウンロード：
```bash
ollama pull llama2
```
3. `.env`ファイルを編集：
```env
API_KEY=not_needed
API_MODEL=llama2
API_ENDPOINT=http://localhost:11434/api/generate
```

※ chat.phpの修正が必要です。

## 4. OpenAI互換API

### OpenRouter（複数のモデルに対応）
1. [OpenRouter](https://openrouter.ai/)でアカウント作成
2. `.env`ファイルを編集：
```env
API_KEY=your_openrouter_api_key_here
API_MODEL=openai/gpt-3.5-turbo
API_ENDPOINT=https://openrouter.ai/api/v1/chat/completions
```

## トラブルシューティング

### OpenAI APIの制限を確認
- 無料枠：通常は$18のクレジット（約3ヶ月で失効）
- 使用状況：https://platform.openai.com/usage
- 料金：https://openai.com/pricing

### エラー別対処法
- **429 (Rate Limit)**: 利用制限に達しています
- **401 (Unauthorized)**: APIキーが無効です
- **404 (Not Found)**: モデル名が間違っています