<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="450"
    >
      <v-card
        :loading="crudFormMethods.loading"
      >
        <v-card-text>
          <p :class="`text-h5 header-padding text-center text-title ${statement ? 'text-approved' : 'text-maroon'}`">
            {{ statement ? 'Approve and Release' : 'Cancel Approval' }}
          </p>

          <template v-if="statement">
            <p>This will update the application status to <span class="text-approved">Approved and Released</span>. </p>
            <p>Please provide the following details to proceed:</p>
          </template>
          <template v-else>
            <p>Proceed update status to <span class="text-maroon">Canceled Approval?</span> This can not be undone. </p>
            <p>Kindly, enter why you want to cancel the approval below:</p>
          </template>

          <template v-if="statement">
            <DateComponent
              id="monthInvoice"
              v-model="monthInvoice"
              :value="monthInvoice"
              label="Invoice Date"
              class="required-field"
              :is-dense="false"
              :no-title="false"
              placeholder="YYYY-MM-DD"
              date-class="black--text required-field"
              :error-messages="genericError('monthInvoice','Invoice Date')"
              @input="() => $v.monthInvoice.$touch()"
              @blur="$v.monthInvoice.$touch()"
            />
            <v-text-field
              v-model="monthSubmitted"
              :disabled="true"
              label="Month Submitted"
              :loading="crudFormMethods.loading"
            />
            <v-text-field
              v-model="bankName"
              label="Bank"
              disabled
              :loading="crudFormMethods.loading"
            />
          </template>
          <template v-else>
            <v-textarea
              v-model="cancelRemarks"
              outlined
              class="pa-5"
              label="Remarks"
              :loading="crudFormMethods.loading"
            />
          </template>

          <div class="flex-around">
            <v-btn
              dense
              text
              class="px-10"
              :loading="crudFormMethods.loading"
              @click="dialog = false"
            >
              No
            </v-btn>
            <v-btn
              dense
              text
              :loading="crudFormMethods.loading"
              :class="`px-10 ${statement ? 'text-approved' : 'text-maroon'}`"
              @click="updateStatus"
            >
              Yes
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { validationMixin, validationErrors, custom } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'
import { monthName } from '@/utils/helpers'

export default {
  name: 'ChoiceUpdateStatus',
  mixins: [
    validationMixin
  ],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    condition: {
      type: String,
      default: ''
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    },
    bank: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    cancelRemarks: '',
    monthInvoice: '',
    items: ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }),
  computed: {
    ...validationErrors,
    ...mapFields('application', {
      dateSubmitted: 'dateSubmitted'
    }),
    statement () {
      return this.condition === 'approve'
    },
    bankName () {
      return this.bank
    },
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  },
  watch: {
    dateSubmitted: {
      handler (obj) {
        const date = new Date(obj)
        this.monthSubmitted = monthName(date.getMonth())
      },
      deep: true
    }
  },
  methods: {
    async update (status) {
      const response = await this.crudFormMethods.api(status).update('', this.statement ? {
        bankApplication: this.$route.params.bank,
        monthInvoice: this.monthInvoice,
        monthSubmitted: this.monthSubmitted
      } : {
        cancelRemarks: this.cancelRemarks,
        bankApplication: this.$route.params.bank
      })
      return response
    },
    async updateApplication (condition) {
      this.crudFormMethods.loading = true
      const resp = await this.update(condition)
      if (resp.ok) {
        this.$store.dispatch('showAlert', {
          message: `Application status successfully updated to ${this.statement ? 'Approve and Release' : 'Cancel Approval'}.`,
          type: 'success'
        })
        this.dialog = false
        this.crudFormMethods.view()
        this.crudFormMethods.loading = false
      } else {
        const error = (await resp.json()).error
        this.$store.dispatch('showAlert', {
          message: error,
          type: 'error'
        })
        this.crudFormMethods.loading = false
      }
    },
    async updateStatus () {
      if (this.condition === 'cancel') {
        this.updateApplication(this.condition)
      } else {
        this.$v.$touch()
        !this.$v.monthInvoice.$invalid && this.updateApplication(this.condition)
      }
    }
  },
  validations () {
    const monthInvoice = custom.monthInvoice
    return {
      monthInvoice
    }
  }
}
</script>

<style scoped>
.header-padding {
  padding-top: 20px;
}
.text-center {
  text-align: center;
}
.flex-around {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 20px;
}
.text-maroon {
  color: maroon;
}
.text-approved {
  color: #4caf50;
}
.text-title {
  font-weight: bold;
}
</style>
