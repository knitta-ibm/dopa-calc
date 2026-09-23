import { useEffect } from 'react'
import { sounds } from '../game/sounds'
import { burstClear } from '../game/effects'
import styles from './ResultScreen.module.css'

const MESSAGES = [
  { emoji: '🏆', text: 'かんぺき！！すごすぎる！' },
  { emoji: '🎉', text: 'すばらしい！！ほぼかんぺき！' },
  { emoji: '😊', text: 'よくできました！もう1かいやってみよう！' },
  { emoji: '💪', text: 'れんしゅうしてうまくなろう！' },
]

const CARD_MESSAGES = [
  { emoji: '🏆', text: 'ぜんもん せいかい！\nすごすぎる！！' },
  { emoji: '🎉', text: 'よくできました！\nほぼかんぺき！' },
  { emoji: '😊', text: 'よくがんばりました！\nもう1かいやってみよう！' },
  { emoji: '💪', text: 'れんしゅうあるのみ！\nまたやってみよう！' },
]

// タイムアタック: スコア（問数）に応じたメッセージ
function getTimeAttackMessage(score) {
  if (score >= 20) return { emoji: '🚀', text: `${score}もん！\nはやすぎる！！` }
  if (score >= 12) return { emoji: '🔥', text: `${score}もん！\nすごい！！` }
  if (score >= 8)  return { emoji: '⭐', text: `${score}もん！\nよくできました！` }
  return { emoji: '💪', text: `${score}もん！\nもっとれんしゅうしよう！` }
}

function getMessage(score, total, isCardMode, isTimeAttack) {
  if (isTimeAttack) return getTimeAttackMessage(score)
  const bank = isCardMode ? CARD_MESSAGES : MESSAGES
  const pct = score / total
  if (pct === 1)   return bank[0]
  if (pct >= 0.8)  return bank[1]
  if (pct >= 0.6)  return bank[2]
  return bank[3]
}

export default function ResultScreen({ score, total, elapsed, isCardMode, isTimeAttack, onRetry, onHome }) {
  const msg = getMessage(score, total, isCardMode, isTimeAttack)

  useEffect(() => {
    sounds.clear()
    burstClear()
  }, [])

  const stars = isTimeAttack
    ? Math.min(5, Math.floor(score / 4))   // 4問ごとに1つ（最大5）
    : Math.round((score / total) * 5)

  return (
    <div className={styles.wrap}>
      <div className={styles.emoji}>{msg.emoji}</div>
      <h2 className={styles.message} style={{ whiteSpace: 'pre-line' }}>{msg.text}</h2>

      {isTimeAttack ? (
        <div className={styles.scoreBox}>
          <span className={styles.score}>{score}</span>
          <span className={styles.correct}>もん　クリア！</span>
        </div>
      ) : (
        <div className={styles.scoreBox}>
          <span className={styles.score}>{score}</span>
          <span className={styles.slash}> / </span>
          <span className={styles.total}>{total}</span>
          <span className={styles.correct}>もん　せいかい</span>
        </div>
      )}

      {isTimeAttack && elapsed != null && (
        <p className={styles.elapsed}>⏱️ {elapsed}びょう</p>
      )}

      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < stars ? styles.starOn : styles.starOff}>★</span>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.retryBtn} onClick={onRetry}>
          🔁 もう1かい
        </button>
        <button className={styles.homeBtn} onClick={onHome}>
          🏠 もどる
        </button>
      </div>
    </div>
  )
}
