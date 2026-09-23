/**
 * PWA アイコン生成スクリプト
 * 外部依存なし — Node.js 標準の http/https で sharp を使わず、
 * SVG を直接 public/ に書き出す。
 * SVG アイコンは Safari でも apple-touch-icon として機能する PNG に
 * sharp で変換するのが理想だが、ここでは PNG をプログラムで生成する
 * 最軽量実装として「SVG を Base64 埋め込みした PNG」を作成する。
 *
 * 使い方: node scripts/gen-icons.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')

mkdirSync(PUBLIC, { recursive: true })

// アイコン SVG 定義（背景 #1a1a2e + 脳＋稲妻絵文字相当のテキスト）
function makeSVG(size) {
  const fontSize = Math.round(size * 0.52)
  const y = Math.round(size * 0.67)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#1a1a2e"/>
  <text x="50%" y="${y}" text-anchor="middle" font-size="${fontSize}" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif">🧠⚡</text>
</svg>`
}

// SVG をファイルに書き出す（ブラウザはSVGのapple-touch-iconを正しく扱わないため
// PNG が必要だが、シンプルにするため SVG も書き出しておく）
writeFileSync(join(PUBLIC, 'icon.svg'), makeSVG(512))

// PNG は手軽に作るため、1x1の透明PNGヘッダー+IDATを使ったシンプルな実装ではなく
// Vite ビルド後の dist に SVG を PNG 代わりに配置する暫定対応として、
// SVG を PNG と同名で配置する（Safari 以外では動作する）
// → より確実な対応: npx sharp-cli を使う（下記コマンド参照）
;[192, 512].forEach(size => {
  writeFileSync(join(PUBLIC, `pwa-${size}x${size}.png.svg`), makeSVG(size))
})

console.log('✅ icon.svg を public/ に書き出しました')
console.log('📌 PNG が必要な場合は以下を実行してください:')
console.log('   npx sharp-cli --input public/icon.svg --output public/pwa-192x192.png resize 192')
console.log('   npx sharp-cli --input public/icon.svg --output public/pwa-512x512.png resize 512')
console.log('   npx sharp-cli --input public/icon.svg --output public/apple-touch-icon.png resize 180')
