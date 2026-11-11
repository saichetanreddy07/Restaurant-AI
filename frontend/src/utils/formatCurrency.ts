const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'string' && amount.trim() === '') {
    throw new TypeError('Currency amount must be a non-empty numeric value.')
  }

  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) {
    throw new TypeError('Currency amount must be a finite number.')
  }

  return inrFormatter.format(numericAmount)
}
