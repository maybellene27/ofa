import { required } from 'vuelidate/lib/validators'

export default {
  time: {
    required
  },
  question: {
    required
  },
  answer: {
    required
  },
  choices: {
    $each: {
      plaintext: {
        required
      }
    }
  }
}
