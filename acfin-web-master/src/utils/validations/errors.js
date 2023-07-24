import messages from './messages'
const allValidators = ['required', 'minLength', 'maxLength', 'email', 'isNameLike', 'oneOf', 'numeric', 'alphaNum', '$each', 'decimal', 'minValue', 'minDate', 'maxDate', 'isYear', 'sameName', 'maxValue', 'fileSize', 'fileFormat', 'isCurrency', 'isValidDate']
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1)
const check = ({ $v, field, fieldName, validator }) => {
  const val = getNestedValue($v, field)
  if (!Object.prototype.hasOwnProperty.call(val, [validator])) return false
  if (typeof val[validator] === 'object') {
    const nestV = val[validator].$iter
    const errs = []
    for (const k in nestV) {
      if (Object.prototype.hasOwnProperty.call(nestV, k)) {
        errs.push(checkAll({
          $v: nestV,
          field: k,
          fieldName: nestV[k].$model,
          validators: allValidators
        }))
      }
    }
    return errs
  } else {
    return !val[validator] && messages[validator]({ $v, field, fieldName })
  }
}
const checkAll = ({ $v, field, fieldName, validators }) => {
  return validators.map((validator) => check({ $v, field, fieldName, validator }))
    .flat(Infinity)
    .filter((i) => i)
}

const getNestedValue = (obj, key) => {
  return key.split('.').reduce((acc, curr) => acc[curr], obj)
}

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce((obj, key) =>
    (obj && obj[key] !== undefined) ? obj[key] : undefined, nestedObj)
}

const validationErrors = {
  genericError: () => function (field, fieldName) {
    const val = getNestedValue(this.$v, field)
    if (!val.$dirty) return []
    return checkAll({
      $v: this.$v,
      field,
      fieldName,
      validators: allValidators
    })
  },
  genericErrorObjectArray: () => function (arrayName, index, field, fieldName) {
    const array = getNestedValue(this.$v, arrayName)
    const val = getNestedValue(array.$each[index], field)
    if (!val.$dirty) return []
    return checkAll({
      $v: array.$each[index],
      field,
      fieldName,
      validators: allValidators
    })
  },
  collectionError: () => function (arrayName, index, field, fieldName) {
    const prop = getNestedValue(this.$v, arrayName)
    const val = getNestedValue(prop.$each[index], field)
    if (!val.$dirty) return []
    return checkAll({
      $v: prop.$each[index],
      field,
      fieldName,
      validators: allValidators
    })
  },
  deepCollectionError: () => function (collection, collectionIndex, subCollection, subCollectionIndex, field, fieldName) {
    const propCollection = getNestedValue(this.$v, collection)
    const prop = getNestedValue(propCollection.$each[collectionIndex], subCollection)
    const val = getNestedValue(prop.$each[subCollectionIndex], field)

    if (!val.$dirty) return []
    return checkAll({
      $v: prop.$each[subCollectionIndex],
      field,
      fieldName,
      validators: allValidators
    })
  },
  genericErrorObjectNestedArray: () => function (arrayName = [], index, field, fieldName) {
    const obj = getNestedObject(this.$v, arrayName)
    const val = getNestedValue(obj.$each[index], field)
    if (!val.$dirty) return []
    return checkAll({
      $v: obj.$each[index],
      field,
      fieldName,
      validators: allValidators
    })
  },
  emailError () {
    const errors = []
    const field = 'email'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].email && errors.push('Must be a valid email address.')
    !this.$v[field].required && errors.push(messages.required({ fieldName: 'Email' }))
    !this.$v[field].maxLength && errors.push(messages.maxLength(this.$v, field))
    return errors
  },
  usernameError () {
    const errors = []
    const field = 'username'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].minLength && errors.push(messages.minLength(this.$v, field))
    !this.$v[field].required && errors.push(messages.required('Username'))
    return errors
  },
  passwordError () {
    const errors = []
    const field = 'password'
    if (!this.$v.password.$dirty) return errors
    !this.$v[field].minLength && errors.push(messages.minLength({ $v: this.$v, field }))
    !this.$v[field].required && errors.push(messages.required({ fieldName: 'Password' }))
    !this.$v[field].maxLength && errors.push(messages.maxLength({ $v: this.$v, field }))
    return errors
  },
  confirmPasswordError () {
    const errors = []
    const field = 'confirmPassword'
    if (!this.$v.confirmPassword.$dirty) return errors
    !this.$v[field].sameAs && errors.push('Entered passwords do not match.')
    return errors
  },
  contactNoError () {
    const errors = []
    const field = 'contactNumber'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].minLength && errors.push(messages.minLength(this.$v, field))
    !this.$v[field].maxLength && errors.push(messages.maxLength(this.$v, field))
    !this.$v[field].required && errors.push(messages.required('Contact number'))
    return errors
  },
  sexError () {
    const errors = []
    const field = 'sex'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].required && errors.push(messages.required('Sex'))
    !this.$v[field].oneOf && errors.push('Must be a valid option.')
    return errors
  },
  zipCodeError () {
    const errors = []
    const field = 'zipCode'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].numeric && errors.push('Must be a number.')
    !this.$v[field].maxLength && errors.push(messages.maxLength(this.$v, field))
    return errors
  },
  houseNoError () {
    const errors = []
    const field = 'houseNo'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].maxLength && errors.push(messages.maxLength(this.$v, field))
    return errors
  },

  requiredError: () => function (field, fieldName) {
    if (!this.$v[field].$dirty) return []
    return checkAll({ $v: this.$v, field, fieldName, validators: ['required', 'maxLength'] })
  },
  invalidOptionError: () => function (field, fieldName) {
    const errors = []
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].required && errors.push(messages.required(fieldName || capitalize(field)))
    // !this.$v[field].oneOf && errors.push('Must be valid option')
    return errors
  },
  maxLengthError: () => function (field, fieldName) {
    const errors = []
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].maxLength && errors.push(messages.maxLength(this.$v, field))
    return errors
  },
  roleNameError () {
    const errors = []
    const field = 'roleName'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].required && errors.push(messages.required('Role name'))
    !this.$v[field].minLength && errors.push(messages.minLength(this.$v, field))
    !this.$v[field].alphaNum && errors.push('Must be alpha-numeric.')
    return errors
  },
  academicUnitError () {
    const errors = []
    const field = 'academicUnit'
    if (!this.$v[field].$dirty) return errors
    !this.$v[field].decimal && errors.push(messages.decimal(this.$v, field))
    !this.$v[field].minValue && errors.push(messages.minValue(this.$v, field))
    return errors
  }
}

export default validationErrors
