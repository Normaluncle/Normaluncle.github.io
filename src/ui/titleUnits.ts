/** Keep Chinese opening/closing punctuation attached inside animated clip boxes. */
export function titleUnits(line: string): string[] {
  const units: string[] = []
  let prefix = ''
  for (const part of line.match(/[A-Za-z0-9]+|./gu) ?? []) {
    if (/^[（(“‘《「『【]$/u.test(part)) { prefix += part; continue }
    if (/^[，。、；：！？,.!?;:）)”’》」』】]$/u.test(part) && units.length && !prefix) {
      units[units.length - 1] += part
    } else {
      units.push(prefix + part)
      prefix = ''
    }
  }
  if (prefix) units.push(prefix)
  // Keep a short Chinese ending (including its closing punctuation) together.
  // This is a fallback for browsers without balanced line wrapping.
  const last = units.at(-1)
  if (units.length > 1 && last && (last.match(/\p{Script=Han}/gu)?.length ?? 0) === 1 && /\p{Script=Han}$/u.test(units.at(-2)!)) {
    units.splice(-2, 2, units.at(-2)! + last)
  }
  return units
}
