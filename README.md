# flayer

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
```bash
git clone https://github.com/momotaka/flayer.git
cd flayer
```

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

## トラブルシューティング

### セットアップ確認
```bash
php check_setup.php
```
このコマンドで環境設定をチェックできます。

### 500エラーが出る場合
1. `.env`ファイルが存在するか確認
   ```bash
   ls -la .env
   # ない場合は作成
   cp .env.example .env
   ```

2. APIキーが正しく設定されているか確認
   ```bash
   # .envファイルを編集
   nano .env  # またはお好みのエディタで
   ```

3. PHPがインストールされているか確認
   ```bash
   php -v
   # PHP 7.0以上が必要
   ```

4. 必要なPHP拡張機能を確認
   ```bash
   php -m | grep -E 'json|curl'
   ```

## 使い方

1. **自動開始**: ページを開くと自動的に最初の質問が表示
2. **質問に回答**: 画面上部の質問に答えていく
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