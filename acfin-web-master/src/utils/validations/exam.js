import { required } from 'vuelidate/lib/validators'

export default {
  subject: {
    required
  },
  topic: {
    required
  },
  passingRate: {
    required
  },
  segments: {
    $each: {
      totalTime: {
        required
      },
      order: {
        required
      },
      items: {
        $each: {
          _id: {
            required
          },
          question: {
            required
          },
          time: {
            required
          }
        }
      }
    }
  }
}
