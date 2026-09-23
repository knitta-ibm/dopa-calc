import { useState } from 'react'
import StartScreen  from './components/StartScreen'
import GameScreen   from './components/GameScreen'
import ResultScreen from './components/ResultScreen'
import {
  generateAdditionDeck,
  generateSubtractionDeck,
  shuffle,
} from './game/problemGenerator'

/**
 * mode:
 *   'random'      — ランダム計算ゲーム（既存）
 *   'card-add'    — たしざんカード
 *   'card-sub'    — ひきざんカード
 *   'time-attack' — タイムアタック
 *
 * cardOrder: 'order' | 'random'
 */
export default function App() {
  const [screen, setScreen]         = useState('start')
  const [level, setLevel]           = useState('easy')
  const [cardProblems, setCardProblems] = useState(null)
  const [mode, setMode]             = useState('random')
  const [timeLimit, setTimeLimit]   = useState(60)
  const [result, setResult]         = useState(null)

  function handleStartRandom(selectedLevel) {
    setMode('random')
    setLevel(selectedLevel)
    setCardProblems(null)
    setScreen('game')
  }

  function handleStartCard(type, order) {
    const deck = type === 'add'
      ? generateAdditionDeck()
      : generateSubtractionDeck()
    setMode(type === 'add' ? 'card-add' : 'card-sub')
    setCardProblems(order === 'random' ? shuffle(deck) : deck)
    setScreen('game')
  }

  function handleStartTimeAttack(selectedLevel, seconds) {
    setMode('time-attack')
    setLevel(selectedLevel)
    setTimeLimit(seconds)
    setCardProblems(null)
    setScreen('game')
  }

  function handleFinish(gameResult) {
    setResult(gameResult)
    setScreen('result')
  }

  function handleRetry() {
    if (mode === 'random') {
      setScreen('game')
    } else if (mode === 'time-attack') {
      setScreen('game')
    } else {
      const deck = mode === 'card-add'
        ? generateAdditionDeck()
        : generateSubtractionDeck()
      setCardProblems(shuffle(deck))
      setScreen('game')
    }
  }

  return (
    <>
      {screen === 'start'  && (
        <StartScreen
          onStartRandom={handleStartRandom}
          onStartCard={handleStartCard}
          onStartTimeAttack={handleStartTimeAttack}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          key={`${mode}-${screen}-${Date.now()}`}
          level={level}
          problems={cardProblems}
          isCardMode={mode !== 'random' && mode !== 'time-attack'}
          isTimeAttack={mode === 'time-attack'}
          timeLimit={timeLimit}
          onFinish={handleFinish}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          score={result.score}
          total={result.total}
          elapsed={result.elapsed}
          isCardMode={mode !== 'random' && mode !== 'time-attack'}
          isTimeAttack={mode === 'time-attack'}
          onRetry={handleRetry}
          onHome={() => setScreen('start')}
        />
      )}
    </>
  )
}
