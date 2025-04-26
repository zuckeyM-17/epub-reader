# EPUBリーダー

> **注:** このプロジェクトはCline（AI開発アシスタント）を使用して開発されました。コードの設計、実装、ドキュメント作成など、すべての作業はClineのサポートにより行われています。

ブラウザで動作するシンプルなEPUBリーダーです。TypeScriptとbiomeを使用して開発されています。

## 機能

- EPUBファイルの読み込みと表示
- ページ間のナビゲーション
- 目次の表示と章へのジャンプ
- サイドバーの表示/非表示
- キーボードナビゲーション（左右矢印キー）

## 技術スタック

- HTML/CSS/JavaScript
- TypeScript
- biome（コード品質ツール）
- epub.js（EPUBパーサーとレンダラー）

## 開発方法

### 必要条件

- Node.js
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start
```

### 利用可能なスクリプト

- `npm run build` - TypeScriptのコンパイル
- `npm run watch` - TypeScriptの変更を監視してコンパイル
- `npm run format` - biomeでコードをフォーマット
- `npm run lint` - biomeでコードをリント
- `npm run check` - biomeでコードをチェックして修正
- `npm run start` - 開発サーバーの起動
- `npm run deploy` - GitHub Pages用のファイルを生成
- `npm run serve:docs` - GitHub Pages用のファイルをローカルでプレビュー

## GitHub Pagesでの公開方法

### 自動デプロイ（GitHub Actions）

このリポジトリはGitHub Actionsを使用して、mainブランチへのプッシュ時に自動的にビルドとデプロイを行います。

1. リポジトリをGitHubにプッシュします
2. mainブランチへの変更がプッシュされると、GitHub Actionsが自動的にビルドとデプロイを実行します
3. GitHubリポジトリの設定ページで、GitHub Pagesのソースを「docs」フォルダに設定します

### 手動デプロイ

手動でデプロイする場合は、以下の手順に従ってください：

1. リポジトリをGitHubにプッシュします
2. `npm run deploy`を実行してdocsディレクトリにファイルを生成します
3. 変更をコミットしてGitHubにプッシュします
4. GitHubリポジトリの設定ページで、GitHub Pagesのソースを「docs」フォルダに設定します

## ライセンス

ISC
