let pad = (char, n, s) => char.repeat(n - s.length) + s

export default t => {
  let s = t
  let m = s / 60 | 0
  s -= m * 60
  let h = m / 60 | 0
  m -= h * 60

  let str = `:` + pad(`0`, 2, String(s))
  return (h > 0 ? h + `:` + pad(`0`, 2, String(m)) : m) + str
}
