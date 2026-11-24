type DecimalInputRules = {
  minimum: number
  minimumIsExclusive: boolean
  maximumDigits: number
  decimalPlaces: number
}

export const validateDecimalInput = (
  value: string,
  label: string,
  rules: DecimalInputRules,
): string | undefined => {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return `${label} is required.`
  }

  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmedValue)) {
    return `${label} must be a valid number.`
  }

  const unsignedValue = trimmedValue.startsWith('-')
    ? trimmedValue.slice(1)
    : trimmedValue
  const [wholePart, decimalPart = ''] = unsignedValue.split('.')
  const significantWholePart = wholePart.replace(/^0+/, '')
  const significantDecimalPart = decimalPart.replace(/0+$/, '')
  const maximumWholeDigits = rules.maximumDigits - rules.decimalPlaces

  if (
    significantDecimalPart.length > rules.decimalPlaces ||
    significantWholePart.length > maximumWholeDigits ||
    significantWholePart.length + significantDecimalPart.length >
      rules.maximumDigits
  ) {
    return `${label} must fit within ${rules.maximumDigits} total digits, with up to ${rules.decimalPlaces} decimal places.`
  }

  const numericValue = Number(trimmedValue)
  if (!Number.isFinite(numericValue)) {
    return `${label} must be a finite number.`
  }

  if (
    rules.minimumIsExclusive
      ? numericValue <= rules.minimum
      : numericValue < rules.minimum
  ) {
    const comparison = rules.minimumIsExclusive ? 'greater than' : 'at least'
    return `${label} must be ${comparison} ${rules.minimum}.`
  }

  return undefined
}
