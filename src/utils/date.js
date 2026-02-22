export function toLocalInputValue(dateLike) {
  if (!dateLike) return ''
  const date = new Date(dateLike)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function prettyDateTime(dateLike) {
  if (!dateLike) return '-'
  return new Date(dateLike).toLocaleString()
}

export function monthMatrix(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1)
  const firstWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day))
  }
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const rows = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }

  return rows
}

export function dayKey(dateLike) {
  const d = new Date(dateLike)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
