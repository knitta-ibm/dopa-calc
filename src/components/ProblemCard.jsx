import styles from './ProblemCard.module.css'

/**
 * floatKey: 正解のたびに変わるキー。変わるたびに +1 アニメーションが再生される。
 *           null のとき非表示。
 */
export default function ProblemCard({ problem, input, feedback, shake, floatKey }) {
  const { a, b, op } = problem
  const displayAnswer = input !== '' ? input : '？'

  const cardClass = [
    styles.card,
    feedback === 'correct' ? styles.correct : '',
    feedback === 'wrong'   ? styles.wrong   : '',
    shake                  ? styles.shake   : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      {feedback === 'correct' && <div className={styles.feedbackBadge}>✅ せいかい！</div>}
      {feedback === 'wrong'   && <div className={styles.feedbackBadgeWrong}>❌ もう1かい</div>}

      {/* フローティング +1 */}
      {floatKey !== null && floatKey !== undefined && (
        <div key={floatKey} className={styles.floatScore}>+1 ✨</div>
      )}

      <div className={styles.equation}>
        <span className={styles.num}>{a}</span>
        <span className={styles.op}>{op}</span>
        <span className={styles.num}>{b}</span>
        <span className={styles.eq}>=</span>
        <span className={`${styles.answer} ${input ? styles.answerFilled : ''}`}>
          {displayAnswer}
        </span>
      </div>
    </div>
  )
}
