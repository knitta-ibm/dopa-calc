import confetti from 'canvas-confetti'

/** 正解時の小さいエフェクト */
export function burstCorrect() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6c63ff', '#ff6584', '#43d9ad', '#ffd700'],
  })
}

/** コンボ時の大きいエフェクト */
export function burstCombo() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#ff6584', '#ffd700', '#6c63ff', '#43d9ad'],
    startVelocity: 40,
  })
  // 左右から追加
  setTimeout(() => {
    confetti({ particleCount: 50, angle: 60,  spread: 55, origin: { x: 0 } })
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } })
  }, 100)
}

/** ゲームクリア時の豪華エフェクト */
export function burstClear() {
  const duration = 2000
  const end = Date.now() + duration
  ;(function frame() {
    confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 } })
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
