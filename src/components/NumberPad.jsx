import styles from './NumberPad.module.css'

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['DEL', '0', 'OK'],
]

export default function NumberPad({ onPress, disabled }) {
  return (
    <div className={styles.pad}>
      {KEYS.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map((key) => (
            <button
              key={key}
              className={[
                styles.key,
                key === 'OK'  ? styles.ok  : '',
                key === 'DEL' ? styles.del : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onPress(key)}
              disabled={disabled}
              aria-label={key === 'DEL' ? '消す' : key === 'OK' ? '決定' : key}
            >
              {key === 'DEL' ? '⌫' : key === 'OK' ? '✓' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
