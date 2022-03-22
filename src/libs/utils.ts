/**
 * 999 -> 999, 1300 -> 1.3k
 * https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
 * @param number
 * @param decPlaces
 * @returns {*}
 */
export const abbrNum = (number: any, decPlaces = 1) => {
  decPlaces = Math.pow(10, decPlaces)
  const abbrev = ['k', 'm', 'b', 't']

  for (let i = abbrev.length - 1; i >= 0; i--) {
    const size = Math.pow(10, (i + 1) * 3)
    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces
      if (number === 1000 && i < abbrev.length - 1) {
        number = 1
        i++
      }

      number += abbrev[i]
      break
    }
  }

  return number
}

export const toggleTheme = <T = string | undefined>(
  theme: T,
  oldTheme?: T
): T => {
  if (document.body?.classList.contains('theme-' + oldTheme))
    document.body.classList.remove('theme-' + oldTheme)

  document.body?.classList.add('theme-' + theme)

  return theme
}

export const asyncTimeout = (timeout: number = 100) =>
  new Promise((r) => setTimeout(r, timeout))
