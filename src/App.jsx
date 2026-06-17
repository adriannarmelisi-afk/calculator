import { useState, useEffect, useCallback } from 'react'
import './App.css'

const operate = (a, b, op) => {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? NaN : a / b
    default: return b
  }
}

// Trim floating-point noise (e.g. 0.1 + 0.2) and keep the display tidy.
const format = (n) => {
  if (!isFinite(n)) return 'Error'
  return parseFloat(n.toPrecision(12)).toString()
}

export default function App() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState(null)   // left-hand operand
  const [op, setOp] = useState(null)           // pending operator
  const [fresh, setFresh] = useState(true)     // next digit starts a new number

  const inputDigit = useCallback((d) => {
    setDisplay((cur) => {
      if (fresh) return d
      if (cur === '0' && d !== '.') return d
      if (d === '.' && cur.includes('.')) return cur
      return cur + d
    })
    setFresh(false)
  }, [fresh])

  const chooseOp = useCallback((nextOp) => {
    const value = parseFloat(display)
    if (op && !fresh) {
      const result = operate(stored, value, op)
      setStored(result)
      setDisplay(format(result))
    } else {
      setStored(value)
    }
    setOp(nextOp)
    setFresh(true)
  }, [display, op, stored, fresh])

  const equals = useCallback(() => {
    if (op == null) return
    const value = parseFloat(display)
    const result = operate(stored, value, op)
    setDisplay(format(result))
    setStored(null)
    setOp(null)
    setFresh(true)
  }, [display, op, stored])

  const clear = useCallback(() => {
    setDisplay('0')
    setStored(null)
    setOp(null)
    setFresh(true)
  }, [])

  const toggleSign = useCallback(() => {
    setDisplay((cur) => (cur === '0' ? cur : format(parseFloat(cur) * -1)))
  }, [])

  const percent = useCallback(() => {
    setDisplay((cur) => format(parseFloat(cur) / 100))
    setFresh(true)
  }, [])

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      const { key } = e
      if (key >= '0' && key <= '9') inputDigit(key)
      else if (key === '.') inputDigit('.')
      else if (key === '+') chooseOp('+')
      else if (key === '-') chooseOp('-')
      else if (key === '*') chooseOp('×')
      else if (key === '/') { e.preventDefault(); chooseOp('÷') }
      else if (key === 'Enter' || key === '=') { e.preventDefault(); equals() }
      else if (key === 'Escape') clear()
      else if (key === '%') percent()
      else if (key === 'Backspace') {
        setDisplay((cur) => (cur.length <= 1 ? '0' : cur.slice(0, -1)))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inputDigit, chooseOp, equals, clear, percent])

  const keys = [
    { label: 'AC', onClick: clear, cls: 'fn' },
    { label: '±', onClick: toggleSign, cls: 'fn' },
    { label: '%', onClick: percent, cls: 'fn' },
    { label: '÷', onClick: () => chooseOp('÷'), cls: 'op' },
    { label: '7', onClick: () => inputDigit('7') },
    { label: '8', onClick: () => inputDigit('8') },
    { label: '9', onClick: () => inputDigit('9') },
    { label: '×', onClick: () => chooseOp('×'), cls: 'op' },
    { label: '4', onClick: () => inputDigit('4') },
    { label: '5', onClick: () => inputDigit('5') },
    { label: '6', onClick: () => inputDigit('6') },
    { label: '-', onClick: () => chooseOp('-'), cls: 'op' },
    { label: '1', onClick: () => inputDigit('1') },
    { label: '2', onClick: () => inputDigit('2') },
    { label: '3', onClick: () => inputDigit('3') },
    { label: '+', onClick: () => chooseOp('+'), cls: 'op' },
    { label: '0', onClick: () => inputDigit('0'), cls: 'zero' },
    { label: '.', onClick: () => inputDigit('.') },
    { label: '=', onClick: equals, cls: 'op' },
  ]

  return (
    <div className="calculator">
      <div className="display" data-testid="display">{display}</div>
      <div className="keypad">
        {keys.map((k) => (
          <button
            key={k.label}
            className={`key ${k.cls || ''}`}
            onClick={k.onClick}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  )
}
