// The stored income ranges use an en dash ("₹1–2.5 lakh") to match the
// database check; show them with a plain hyphen.
export function formatIncomeRange(range: string) {
  return range.replace('–', '-')
}
