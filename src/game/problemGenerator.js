/**
 * 問題生成ロジック
 * レベル:
 *   easy   — 足し算のみ、答えが10以下
 *   normal — 足し算・引き算、答えが20以下
 *   hard   — 足し算・引き算、答えが99以下
 *
 * 計算カード:
 *   generateAdditionDeck()    — たしざんカード全問 (1+1〜9+1, 計36問)
 *   generateSubtractionDeck() — ひきざんカード全問 (2-1〜10-9, 計45問)
 *   shuffle(arr)              — デッキをランダム順に並び替え
 */

const CONFIGS = {
  easy:   { ops: ['+'],      max: 10 },
  normal: { ops: ['+', '-'], max: 20 },
  hard:   { ops: ['+', '-'], max: 99 },
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateProblem(level = 'easy') {
  const { ops, max } = CONFIGS[level]
  const op = ops[Math.floor(Math.random() * ops.length)]

  let a, b
  if (op === '+') {
    a = randInt(1, max - 1)
    b = randInt(1, max - a)
  } else {
    // 引き算は必ず答えが 0 以上
    a = randInt(1, max)
    b = randInt(0, a)
  }

  return { a, b, op, answer: op === '+' ? a + b : a - b }
}

export function generateSession(level = 'easy', count = 10) {
  return Array.from({ length: count }, () => generateProblem(level))
}

/**
 * たしざんカード: a+b, a=1〜9, b=1〜(10-a)
 * 例: 1+1,1+2,...1+9, 2+1,...2+8, ..., 9+1  計45問
 */
export function generateAdditionDeck() {
  const deck = []
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 10 - a; b++) {
      deck.push({ a, b, op: '+', answer: a + b })
    }
  }
  return deck
}

/**
 * ひきざんカード: a-b, a=2〜10, b=1〜(a-1)
 * 例: 2-1, 3-1,3-2, 4-1,...4-3, ..., 10-9  計45問
 */
export function generateSubtractionDeck() {
  const deck = []
  for (let a = 2; a <= 10; a++) {
    for (let b = 1; b <= a - 1; b++) {
      deck.push({ a, b, op: '-', answer: a - b })
    }
  }
  return deck
}

/** Fisher-Yates シャッフル（元の配列は変更しない） */
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
