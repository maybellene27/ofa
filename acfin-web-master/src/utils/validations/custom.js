import { helpers } from 'vuelidate/lib/validators'

export const oneOf = (options) => (val) => options.includes(val)
export const isNameLike = helpers.regex('nameLike', /^[[0-9,a-z,A-Z,á,é,í,ó,ú,â,ê,ô,ã,õ,ç,Á,É,Í,Ó,Ú,Â,Ê,Ô,Ã,Õ,Ç,ü,ñ,Ü,Ñ,' ']+(([ ][0-9,a-z,A-Z,á,é,í,ó,ú,â,ê,ô,ã,õ,ç,Á,É,Í,Ó,Ú,Â,Ê,Ô,Ã,Õ,Ç,ü,ñ,Ü,Ñ,' '])?[0-9,a-z,A-Z,á,é,í,ó,ú,â,ê,ô,ã,õ,ç,Á,É,Í,Ó,Ú,Â,Ê,Ô,Ã,Õ,Ç,ü,ñ,Ü,Ñ,' ']*)*$/)
export const minDate = (date) => helpers.withParams({ type: 'minDate', min: date }, value => !helpers.req(value) || value >= date)
export const maxDate = (date) => helpers.withParams({ type: 'maxDate', max: date }, value => !helpers.req(value) || value <= date)
export const isYear = helpers.regex('dateLike', /^[12]\d{3}$/)
export const isCurrency = helpers.regex('currencyLike', /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/)
export const isValidDate = helpers.regex('validDate', /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)

export const sameName = (name, arr, field, id) => (value) => {
  if (arr) {
    const filtered = arr.filter((value) => {
      return value._id !== id
    })
    return !helpers.req(value) || !filtered.some((i) => {
      if (i[field]) {
        return i[field].toLowerCase().replace(/\s/g, '') === name.replace(/\s/g, '')
      }
    })
  }
}

export const fileSize = (options = {}) => {
  return helpers.withParams(options, files => {
    let bool = true
    if (!files) return true
    if (Array.isArray(files)) {
      files.forEach((file) => {
        const { size } = file
        if ((size / 1048576) > options.max) {
          bool = false
        }
      })
    } else {
      const { size } = files
      if ((size / 1048576) > options.max) {
        bool = false
      }
    }

    return bool
  })
}

export const fileFormat = (options = {}) => {
  return helpers.withParams(options, files => {
    let bool = true
    if (!files) {
      return true
    }
    if (Array.isArray(files)) {
      files.forEach((file) => {
        const { name } = file
        if (name && !options.format.includes(name.split('.').pop().toLowerCase())) {
          bool = false
        }
      })
    } else {
      const { name } = files
      if (name && !options.format.includes(name.split('.').pop().toLowerCase())) {
        bool = false
      }
    }
    return bool
  })
}
