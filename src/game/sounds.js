/**
 * 音の管理（Web Audio API）
 * 正解時は ド・ミ・ソ の和音、コンボ時はより高い和音
 */

let audioCtx = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

function beep({ frequency = 440, duration = 0.15, type = 'sine', gainValue = 0.25 } = {}) {
  try {
    const ctx  = getCtx()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(gainValue, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // AudioContext が使えない環境では無音
  }
}

/** 和音を同時に鳴らす */
function chord(frequencies, { duration = 0.2, type = 'sine', gainValue = 0.18 } = {}) {
  frequencies.forEach((freq) => beep({ frequency: freq, duration, type, gainValue }))
}

export const sounds = {
  /** 正解：ド・ミ・ソ の和音 → 一瞬遅れて高音 */
  correct() {
    chord([523, 659, 784])                          // ドミソ（同時）
    setTimeout(() => beep({ frequency: 1047, duration: 0.15, gainValue: 0.2 }), 180) // 高いド
  },

  /** コンボ：ミ・ソ・シ → さらに上昇 */
  combo() {
    chord([659, 784, 988])                          // ミソシ
    setTimeout(() => chord([784, 1047, 1319], { duration: 0.2, gainValue: 0.18 }), 150) // ソドミ
  },

  /** 不正解：低い下降音（変更なし） */
  wrong() {
    beep({ frequency: 220, duration: 0.15, type: 'sawtooth', gainValue: 0.18 })
    setTimeout(() => beep({ frequency: 165, duration: 0.2, type: 'sawtooth', gainValue: 0.13 }), 150)
  },

  /** ゲームクリア：上昇ファンファーレ（和音で締め） */
  clear() {
    const steps = [
      { delay: 0,   freqs: [523, 659] },
      { delay: 150, freqs: [659, 784] },
      { delay: 300, freqs: [784, 988] },
      { delay: 450, freqs: [523, 659, 784, 1047] }, // 最後は全和音
    ]
    steps.forEach(({ delay, freqs }) => {
      setTimeout(() => chord(freqs, { duration: 0.25, gainValue: 0.2 }), delay)
    })
  },

  /** タイムアタック終了：カウントダウン締めビープ */
  timesUp() {
    beep({ frequency: 440, duration: 0.1, gainValue: 0.3 })
    setTimeout(() => beep({ frequency: 330, duration: 0.1, gainValue: 0.3 }), 120)
    setTimeout(() => beep({ frequency: 220, duration: 0.35, gainValue: 0.35 }), 240)
  },
}
