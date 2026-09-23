import { useState, useEffect, useCallback, useRef } from 'react'
import { generateSession } from '../game/problemGenerator'
import { sounds } from '../game/sounds'
import { burstCorrect, burstCombo } from '../game/effects'
import ProblemCard from './ProblemCard'
import NumberPad from './NumberPad'
import styles from './GameScreen.module.css'

const RANDOM_TOTAL = 10
// タイムアタックは無限問題（答えるたびに次が来る）
const TA_POOL = 200

/**
 * props:
 *   level        — 難易度
 *   problems     — カードモード時は外部から渡す問題配列。null ならランダム生成
 *   isCardMode   — true のとき「カードモード」UI
 *   isTimeAttack — true のとき「タイムアタック」モード
 *   timeLimit    — タイムアタックの制限秒数（デフォルト60）
 *   onFinish     — ({ score, total, elapsed? }) => void
 */
export default function GameScreen({
  level,
  problems: externalProblems,
  isCardMode,
  isTimeAttack,
  timeLimit = 60,
  onFinish,
  onHome,
}) {
  const [problems] = useState(() => {
    if (externalProblems) return externalProblems
    const count = isTimeAttack ? TA_POOL : RANDOM_TOTAL
    return generateSession(level, count)
  })
  const total = problems.length

  const [index, setIndex]       = useState(0)
  const [input, setInput]       = useState('')
  const [combo, setCombo]       = useState(0)
  const [score, setScore]       = useState(0)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong'
  const [shake, setShake]       = useState(false)
  const [floatKey, setFloatKey] = useState(null)  // 変わるたびに +1 アニメ再生

  // タイムアタック用
  const [timeLeft, setTimeLeft] = useState(isTimeAttack ? timeLimit : null)
  const startTimeRef = useRef(Date.now())
  const finishedRef  = useRef(false)
  const scoreRef     = useRef(0) // setTimeout 内で最新スコアを参照するため

  // タイムアタック: カウントダウン
  useEffect(() => {
    if (!isTimeAttack) return
    if (timeLeft <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true
        sounds.timesUp()
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
        onFinish({ score: scoreRef.current, total: scoreRef.current, elapsed })
      }
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, isTimeAttack, onFinish])

  const current = problems[index]

  // コンボに応じたクラス
  const comboClass = [
    styles.combo,
    combo >= 8 ? styles.combo8 : combo >= 5 ? styles.combo5 : '',
  ].filter(Boolean).join(' ')

  const submit = useCallback((val) => {
    if (feedback) return
    if (finishedRef.current) return
    const num = parseInt(val, 10)
    const isCorrect = num === current.answer

    if (isCorrect) {
      const newCombo = combo + 1
      const newScore = score + 1
      setCombo(newCombo)
      setScore(newScore)
      scoreRef.current = newScore
      setFeedback('correct')
      setFloatKey(Date.now()) // 毎回ユニークなキーで +1 アニメ再生

      if (newCombo >= 3) {
        sounds.combo()
        burstCombo()
      } else {
        sounds.correct()
        burstCorrect()
      }

      setTimeout(() => {
        setFeedback(null)
        setInput('')
        setFloatKey(null)

        if (isTimeAttack) {
          // タイムアタックは次の問題へ（プール切れ対策で循環）
          setIndex((i) => (i + 1) % TA_POOL)
        } else {
          if (index + 1 >= total) {
            const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
            finishedRef.current = true
            onFinish({ score: newScore, total, elapsed })
          } else {
            setIndex((i) => i + 1)
          }
        }
      }, 500)
    } else {
      setCombo(0)
      setFeedback('wrong')
      setShake(true)
      sounds.wrong()
      setTimeout(() => {
        setFeedback(null)
        setShake(false)
        setInput('')
      }, 600)
    }
  }, [feedback, combo, score, current, index, total, isTimeAttack, onFinish])

  // キーボード対応
  useEffect(() => {
    const handler = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        setInput((prev) => (prev.length < 2 ? prev + e.key : prev))
      } else if (e.key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1))
      } else if (e.key === 'Enter' && input) {
        submit(input)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [input, submit])

  const progress = isTimeAttack
    ? ((timeLimit - (timeLeft ?? 0)) / timeLimit) * 100
    : (index / total) * 100

  const timerDanger = isTimeAttack && timeLeft !== null && timeLeft <= 5

  return (
    <div className={styles.wrap}>
      {/* ヘッダー */}
      <div className={styles.header}>
        {isTimeAttack ? (
          <span className={`${styles.timerWrap}${timerDanger ? ` ${styles.danger}` : ''}`}>
            ⏱️ {timeLeft}s
          </span>
        ) : isCardMode ? (
          <span className={styles.scoreLabel}>🃏 カード</span>
        ) : (
          <span className={styles.scoreLabel}>⭐ {score}/{total}</span>
        )}

        {combo >= 2 && (
          <span key={combo} className={comboClass}>{combo} コンボ！{combo >= 8 ? '🌈' : combo >= 5 ? '🔥' : '💥'}</span>
        )}

        <div className={styles.headerRight}>
          {isTimeAttack
            ? <span className={styles.scoreLabel}>⭐ {score}</span>
            : <span className={styles.qNum}>{index + 1} / {total}</span>
          }
          <button
            className={styles.homeBtn}
            onClick={onHome}
            aria-label="ホームに戻る"
          >
            🏠
          </button>
        </div>
      </div>

      {/* プログレスバー */}
      <div className={styles.progressBg}>
        <div
          className={styles.progressBar}
          style={{
            width: `${progress}%`,
            background: timerDanger
              ? 'linear-gradient(90deg, #ff6584, #ff9500)'
              : undefined,
          }}
        />
      </div>

      {/* 問題カード */}
      <ProblemCard
        problem={current}
        input={input}
        feedback={feedback}
        shake={shake}
        floatKey={floatKey}
      />

      {/* テンキー */}
      <NumberPad
        onPress={(val) => {
          if (val === 'DEL') {
            setInput((prev) => prev.slice(0, -1))
          } else if (val === 'OK') {
            if (input) submit(input)
          } else {
            setInput((prev) => (prev.length < 2 ? prev + val : prev))
          }
        }}
        disabled={!!feedback}
      />
    </div>
  )
}
