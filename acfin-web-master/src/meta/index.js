import app from './app'
import forms from './forms'
import errors from './errors'
import agreement from './agreement'

const metaMixin = {
  data: () => ({
    $meta: {
      app,
      forms,
      errors,
      agreement
    }
  })
}

export {
  app,
  metaMixin,
  forms,
  errors,
  agreement
}
const meta = {
  app,
  errors,
  forms,
  agreement
}

export default meta
