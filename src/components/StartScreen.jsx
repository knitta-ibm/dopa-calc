import { useState } from 'react'
import styles from './StartScreen.module.css'

const LEVELS = [
  { id: 'easy',   label: 'かんたん',   emoji: '⭐',     desc: 'たしざん　こたえが10まで' },
  { id: 'normal', label: 'ふつう',     emoji: '⭐⭐',   desc: 'たしざん・ひきざん　20まで' },
  { id: 'hard',   label: 'むずかしい', emoji: '⭐⭐⭐', desc: 'たしざん・ひきざん　99まで' },
]

const CARD_TYPES = [
  { id: 'add', label: 'たしざんカード', emoji: '➕', desc: '1+1〜9+1　ぜんぶで45もん' },
  { id: 'sub', label: 'ひきざんカード', emoji: '➖', desc: '2−1〜10−9　ぜんぶで45もん' },
]

const TIME_OPTIONS = [
  { seconds: 30, label: '30びょう', emoji: '⚡', desc: 'ちょうせん！はやさじまん' },
  { seconds: 60, label: '1ぷん',   emoji: '🔥', desc: 'スタンダード　おすすめ！' },
]

export default function StartScreen({ onStartRandom, onStartCard, onStartTimeAttack }) {
  // 'main' | 'card-select-type' | 'card-select' | 'time-select'
  const [view, setView]         = useState('main')
  const [cardType, setCardType] = useState(null)
  // タイムアタック: 難易度選択後に時間選択
  const [taLevel, setTaLevel]   = useState(null)

  /* ──── カード: 難易度ビュー ──── */
  if (view === 'card-select' && cardType) {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <span className={styles.titleEmoji}>{cardType === 'add' ? '➕' : '➖'}</span>
          <h1 className={styles.titleText}>{cardType === 'add' ? 'たしざんカード' : 'ひきざんカード'}</h1>
          <p className={styles.subtitle}>じゅんばんを　えらんでね</p>
        </div>
        <div className={styles.levels}>
          <button className={styles.levelBtn} onClick={() => onStartCard(cardType, 'order')}>
            <span className={styles.levelEmoji}>📖</span>
            <span className={styles.levelLabel}>じゅんばん</span>
            <span className={styles.levelDesc}>1+1からじゅんに　ならべたカード</span>
          </button>
          <button className={styles.levelBtn} onClick={() => onStartCard(cardType, 'random')}>
            <span className={styles.levelEmoji}>🔀</span>
            <span className={styles.levelLabel}>ランダム</span>
            <span className={styles.levelDesc}>まぜまぜ！どの問題がでるかな？</span>
          </button>
          <button
            className={`${styles.levelBtn} ${styles.backBtn}`}
            onClick={() => { setCardType(null); setView('card-select-type') }}
          >
            <span className={styles.levelEmoji}>◀</span>
            <span className={styles.levelLabel}>もどる</span>
            <span className={styles.levelDesc}></span>
          </button>
        </div>
      </div>
    )
  }

  /* ──── カード: 種別ビュー ──── */
  if (view === 'card-select-type' || view === 'card-select') {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <span className={styles.titleEmoji}>🃏</span>
          <h1 className={styles.titleText}>計算カード</h1>
          <p className={styles.subtitle}>どっちをやる？</p>
        </div>
        <div className={styles.levels}>
          {CARD_TYPES.map((ct) => (
            <button
              key={ct.id}
              className={styles.levelBtn}
              onClick={() => { setCardType(ct.id); setView('card-select') }}
            >
              <span className={styles.levelEmoji}>{ct.emoji}</span>
              <span className={styles.levelLabel}>{ct.label}</span>
              <span className={styles.levelDesc}>{ct.desc}</span>
            </button>
          ))}
          <button
            className={`${styles.levelBtn} ${styles.backBtn}`}
            onClick={() => setView('main')}
          >
            <span className={styles.levelEmoji}>◀</span>
            <span className={styles.levelLabel}>もどる</span>
            <span className={styles.levelDesc}></span>
          </button>
        </div>
      </div>
    )
  }

  /* ──── タイムアタック: 時間選択ビュー ──── */
  if (view === 'time-select' && taLevel) {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <span className={styles.titleEmoji}>⏱️</span>
          <h1 className={styles.titleText}>タイムアタック</h1>
          <p className={styles.subtitle}>じかんを　えらんでね</p>
        </div>
        <div className={styles.levels}>
          {TIME_OPTIONS.map((t) => (
            <button
              key={t.seconds}
              className={styles.levelBtn}
              onClick={() => onStartTimeAttack(taLevel, t.seconds)}
            >
              <span className={styles.levelEmoji}>{t.emoji}</span>
              <span className={styles.levelLabel}>{t.label}</span>
              <span className={styles.levelDesc}>{t.desc}</span>
            </button>
          ))}
          <button
            className={`${styles.levelBtn} ${styles.backBtn}`}
            onClick={() => { setTaLevel(null); setView('time-level') }}
          >
            <span className={styles.levelEmoji}>◀</span>
            <span className={styles.levelLabel}>もどる</span>
            <span className={styles.levelDesc}></span>
          </button>
        </div>
      </div>
    )
  }

  /* ──── タイムアタック: 難易度選択ビュー ──── */
  if (view === 'time-level') {
    return (
      <div className={styles.wrap}>
        <div className={styles.title}>
          <span className={styles.titleEmoji}>⏱️</span>
          <h1 className={styles.titleText}>タイムアタック</h1>
          <p className={styles.subtitle}>むずかしさを　えらんでね</p>
        </div>
        <div className={styles.levels}>
          {LEVELS.map((lv) => (
            <button
              key={lv.id}
              className={styles.levelBtn}
              onClick={() => { setTaLevel(lv.id); setView('time-select') }}
            >
              <span className={styles.levelEmoji}>{lv.emoji}</span>
              <span className={styles.levelLabel}>{lv.label}</span>
              <span className={styles.levelDesc}>{lv.desc}</span>
            </button>
          ))}
          <button
            className={`${styles.levelBtn} ${styles.backBtn}`}
            onClick={() => setView('main')}
          >
            <span className={styles.levelEmoji}>◀</span>
            <span className={styles.levelLabel}>もどる</span>
            <span className={styles.levelDesc}></span>
          </button>
        </div>
      </div>
    )
  }

  /* ──── メイン画面 ──── */
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>
        <span className={styles.titleEmoji}>🧠⚡</span>
        <h1 className={styles.titleText}>どーぱ計算</h1>
        <p className={styles.subtitle}>さあ、はじめよう！</p>
      </div>

      <p className={styles.sectionLabel}>🎲 ランダムゲーム</p>
      <div className={styles.levels}>
        {LEVELS.map((lv) => (
          <button
            key={lv.id}
            className={styles.levelBtn}
            onClick={() => onStartRandom(lv.id)}
          >
            <span className={styles.levelEmoji}>{lv.emoji}</span>
            <span className={styles.levelLabel}>{lv.label}</span>
            <span className={styles.levelDesc}>{lv.desc}</span>
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <p className={styles.sectionLabel}>⏱️ タイムアタック</p>
      <div className={styles.levels}>
        <button
          className={`${styles.levelBtn} ${styles.timeBtn}`}
          onClick={() => setView('time-level')}
        >
          <span className={styles.levelEmoji}>⏱️</span>
          <span className={styles.levelLabel}>タイムアタック</span>
          <span className={styles.levelDesc}>じかん内に何もん　とけるかな？</span>
        </button>
      </div>

      <div className={styles.divider} />

      <p className={styles.sectionLabel}>🃏 計算カード</p>
      <div className={styles.levels}>
        <button
          className={`${styles.levelBtn} ${styles.cardBtn}`}
          onClick={() => setView('card-select-type')}
        >
          <span className={styles.levelEmoji}>🃏</span>
          <span className={styles.levelLabel}>計算カードを<br />やってみる</span>
          <span className={styles.levelDesc}>たしざん・ひきざん　えらんでね</span>
        </button>
      </div>
    </div>
  )
}
