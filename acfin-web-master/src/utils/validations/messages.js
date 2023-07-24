const getNestedValue = (obj, key) => key.split('.').reduce((acc, curr) => acc[curr], obj)
const messages = {
  required: ({ fieldName }) => `${fieldName} is required.`,
  minLength: ({ $v, field }) => {
    const val = getNestedValue($v, field)
    const n = val.$params.minLength.min

    return `Must be ${n} characters or longer.`
  },
  maxLength: ({ $v, field }) => {
    const val = getNestedValue($v, field)
    const n = val.$params.maxLength.max

    return `Must be ${n} characters or less.`
  },
  email: () => 'Must be a valid email address.',
  isNameLike: () => 'Must not include special characters.',
  oneOf: () => 'Must be a valid option.',
  alphaNum: () => 'Must be alpha-numeric.',
  numeric: () => 'Must be numeric.',
  decimal: () => 'Must be numbers.',
  $each: () => 'An provided value does not follow the proper format.',
  minValue: ({ $v, field }) => {
    const val = getNestedValue($v, field)
    return `Must be greater than ${val.$params.minValue.min}`
  },
  maxValue: ({ $v, field }) => {
    const val = getNestedValue($v, field)
    return `Must be less than ${val.$params.maxValue.max}`
  },
  minDate: () => 'The date is below minimum value required',
  maxDate: () => 'The date is out of maximum value required',
  isYear: () => 'Date must be year only',
  sameName: ({ fieldName }) => `${fieldName} must be unique.`,
  fileSize: ({ $v, field }) => {
    const { max } = getNestedValue($v, field).$params.fileSize
    return `File must be ${max} MB or less.`
  },
  fileFormat: ({ $v, field }) => {
    const { format } = getNestedValue($v, field).$params.fileFormat
    return `File must be in this format: ${format.join(', ')}.`
  },
  isCurrency: () => 'Must be price format only',
  isValidDate: () => 'Must be date format only'
}

export default messages
