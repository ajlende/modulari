const pad = (char, n, s) => char.repeat(n - s.length) + s

const formatTime = (t) => {
  let s = t
  let m = s / 60|0
  s -= m * 60
  let h = m / 60|0 // eslint-disable-line prefer-const
  m -= h * 60

  const hstr = h > 0 ? String(h) : ``
  const mstr = h > 0 ? `:${pad(`0`, 2, String(m))}` : String(m)
  const sstr = `:${pad(`0`, 2, String(s))}`

  return `${hstr}${mstr}${sstr}`
}

const ms = (t) => {
  const s = Math.floor(t / 1000)
  return formatTime(s)
}

export default formatTime
export {ms}
