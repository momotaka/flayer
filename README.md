# チラシ作成AIアシスタント

AIと対話しながら最適なチラシ案を作成するWebアプリケーションです。

## 特徴

- 🤖 AIがユーザーの回答を理解し、適切に整理
- 💡 「分からない」と答えると具体例やアドバイスを提供
- 📝 曖昧な回答もプロフェッショナルな内容に整理
- 📄 完成したチラシ案をテキストファイルでダウンロード
- 🔄 いつでも最初からやり直し可能

## セットアップ

1. リポジトリをクローンまたはダウンロード

2. `.env`ファイルを作成
```bash
cp .env.example .env
```

3. `.env`ファイルを編集してAPIキーを設定
```env
# OpenAI APIの場合
API_KEY=your_openai_api_key_here
API_MODEL=gpt-3.5-turbo
API_ENDPOINT=https://api.openai.com/v1/chat/completions

# Claude APIの場合
API_KEY=your_claude_api_key_here
API_MODEL=claude-3-haiku-20240307
API_ENDPOINT=https://api.anthropic.com/v1/messages
```

4. PHPサーバーを起動
```bash
php -S localhost:8000
```

5. ブラウザで `http://localhost:8000` にアクセス

## 使い方

1. **開始**: 「開始」と入力してチラシ作成を開始
2. **質問に回答**: AIが8つの質問を順番に提示
3. **分からない時**: 「分からない」と答えるとAIがアドバイス
4. **確認と修正**: AIが回答を要約して確認
5. **チラシ案生成**: 全質問終了後、AIが最適なチラシ案を生成
6. **ダウンロード**: テキストファイルとして保存可能

## AIの回答整理機能

- 口語的な表現をビジネス向けに整理
- 要点を抽出して構造化
- 不明確な点は追加質問で詳細化
- プロのマーケターレベルの提案

## 必要な環境

- PHP 7.4以上
- 対応ブラウザ（Chrome, Firefox, Safari, Edge）
- APIキー（OpenAI, Claude, またはGemini）

## ファイル構成

- `index.html` - メインUI
- `app.js` - チャット機能とAI連携
- `chat.php` - AI APIとの通信
- `config.php` - 環境設定
- `download.php` - ファイルダウンロード
- `style.css` - デザイン
- `.env` - API設定（要作成）

## 注意事項

- APIキーは必ず`.env`ファイルに保存し、公開しないでください
- `.gitignore`に`.env`が含まれていることを確認してください
- API利用には料金が発生する場合があります