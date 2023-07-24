import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { metaMixin } from '@/meta'
import alertMixin from '@/mixins/alertMixin'
import { capitalize } from '@/utils/helpers'

export default {
  name: 'AdminProfile',
  data: () => ({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    userRole: [],
    createdBy: '',
    updatedBy: '',
    dateCreated: '',
    dateUpdated: '',
    salutation: '',
    agency: '',
    designation: '',
    position: '',
    id: {
      front: [],
      back: []
    },
    cellphoneNumber: '',
    landline: '',
    fax: '',
    sex: '',
    sexOthers: '',
    birthdate: '',
    researcherType: '',
    researcherTypeOthers: '',
    region: '',
    province: '',
    town: '',
    barangay: '',
    affiliation: '',
    status: '',
    $meta: {
      readOnly: true,
      isLoading: false
    }
  }),
  mixins: [validationMixin, metaMixin, alertMixin],
  validations () {
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      userRole
    } = custom.users

    return {
      firstName,
      middleName,
      lastName,
      suffix,
      email,
      userRole,
      reason: custom.reason
    }
  },
  computed: {
    ...validationErrors,
    updateInfo () {
      const { $meta, createdBy, updatedBy, dateCreated, status, userRole, ...newInfo } = this.$data
      return newInfo
    }
  },
  watch: {
  },
  methods: {
    capitalize,
    confirmDialog (action) {
      const label = this.capitalize(action)
      this.reason = 'action'
      this.$refs.profile.$v.$touch()
      if (!this.$v.$invalid) {
        this.$store.dispatch('showDialog', {
          title: `${label} User`,
          message: `Are you sure you want to ${action} this profile?`,
          buttonLabel: label,
          buttonColor: 'primary',
          callback: () => { this[action]() }
        })
      }
    },
    async getProfileWrap (fn) {
      this.$data.$meta.isLoading = true
      await this.$s.ready
      this.clearProfile()
      const resp = await fn()
      const jData = await resp.json()
      if (resp.ok) {
        const profile = jData.profile || jData.entry
        for (const k in profile) {
          await this.setValue(k, profile)
        }
      } else {
        this.bubbleAlert({
          message: this.$data.$meta.errors.fetchProfile,
          type: 'error'
        })
      }
      this.$data.$meta.isLoading = false
    },
    async updateProfileWrap (fn) {
      this.reason = 'update'
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.$s.ready
        this.$data.$meta.isLoading = true
        const resp = await fn()
        const jData = await resp.json()
        if (resp.ok) {
          this.$data.$meta.readOnly = true
          this.getProfile()
          this.$store.dispatch('showAlert', {
            message: 'Successfully updated user.',
            type: 'success'
          })
        } else {
          this.$store.dispatch('showAlert', {
            message: jData.error || this.$data.$meta.errors.updateProfile,
            type: 'error'
          })
        }
        this.$data.$meta.isLoading = false
      }
    },
    cancel () {
      if (this.operation === 'edit') this.$router.go(-1)
      else {
        this.$data.$meta.readOnly = true
        this.getProfile()
      }
    },
    clearProfile () {
      for (const k in this.$data.$meta.raw) {
        this.$data[k] = this.$data.$meta.raw[k]
      }
    },
    async setValue (k, profile) {
      switch (k) {
        case '_status':
          this.status = profile[k]
          break
        case 'birthdate':
          this[k] = profile[k].split('T')[0]
          break
        case 'dateOfEmployment':
          this[k] = profile[k].split('T')[0]
          break
        case 'address':
          await this.setAddress(profile)
          break
        case 'userRole':
          if (profile[k].includes(',')) {
            this[k] = profile[k].split(', ')
          } else if (!profile[k].includes(',') && ['proponent', 'expert'].includes(profile[k])) {
            this[k] = [profile[k]]
          } else {
            this[k] = profile[k]
          }
          break
        default:
          if (profile[k] && profile[k]._id) this[k] = profile[k]._id
          else this[k] = profile[k]
          break
      }
    },
    vuetifyOpts (entries) {
      return entries.map((i) => ({
        value: i._id,
        text: i.name
      }))
    },
    saveDate (date) {
      this.$refs.menu.save(date)
    }
  }
}
