<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-dialog
          v-model="dialog"
          width="800"
        >
          <v-card
            class="pa-5"
            :loading="crudFormMethods.loading"
          >
            <v-row>
              <v-col class="d-flex justify-center">
                <div>
                  <b>Return Application</b>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="6"
              >
                Kindly, select the required document(s) for the customer to submit
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div>
                  <b>Document(s):</b>
                </div>
              </v-col>
            </v-row>
            <template
              v-if="type === 'Local Based'"
            >
              <v-row>
                <v-col class="ml-5">
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="localCOE"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      COE with compensation details issued not more than 1 month + authorization letter to verify
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="localPayslip"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Copy of Latest 3 months Payslips
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="localITR"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Copy of Latest Income Tax Return (Form 2316)
                    </span>
                  </div>
                </v-col>
              </v-row>
            </template>
            <template
              v-if="type === 'OFW Land Based'"
            >
              <v-row>
                <v-col class="ml-5">
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwLandCOE"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      COE with compensation details issued not more than 1 month + authorization letter to verify
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwLandPayslip"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Copy of Latest 3 months Payslips
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwLandRemittance"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Proof of remittance and latest 3 months bank statement of remittance account + Authorization letter to verify
                    </span>
                  </div>
                </v-col>
              </v-row>
            </template>
            <template
              v-if="type === 'OFW Sea Based'"
            >
              <v-row>
                <v-col class="ml-5">
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwSeaCOE"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      COE with compensation details issued not more than 1 month + authorization letter to verify
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwSeaPayslip"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Copy of Latest 3 months Payslips
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwSeaAllotment"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Proof of allotment and bank statement of remittance account + authorization letter to verify
                    </span>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>
                    <b>Additional Requirement for OFW Sea Based</b>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  class="ml-5"
                >
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwSeaTip"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Tipping Position (ex: F&B and Hotel Operation)
                    </span>
                  </div>
                  <div
                    class="d-flex"
                  >
                    <v-checkbox
                      v-model="ofwSeaVoucher"
                      :loading="crudFormMethods.loading"
                      :disabled="!editable"
                    />
                    <span class="mt-5">
                      Voucher of three (3) months latest bank statements reflecting commission / Tipping Income
                    </span>
                  </div>
                </v-col>
              </v-row>
            </template>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="returnReason"
                  label="Remarks"
                  :loading="crudFormMethods.loading"
                  :disabled="!editable"
                  :outlined="editable"
                />
              </v-col>
            </v-row>
            <v-row
              justify="center"
            >
              <v-col
                class="d-flex justify-end"
              >
                <v-btn
                  class="px-10"
                  :loading="crudFormMethods.loading"
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  class="px-10 white--text"
                  color="grey"
                  :loading="crudFormMethods.loading"
                  @click="returnApplication()"
                >
                  Return
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ReturnDialog',
  components: {
  },
  mixins: [],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    editable: true
  }),
  computed: {
    ...mapFields('application', {
      localCOE: 'vehiclePurchased.local.coe.required',
      localPayslip: 'vehiclePurchased.local.payslip.required',
      localITR: 'vehiclePurchased.local.itr.required',
      ofwLandCOE: 'vehiclePurchased.ofwLandBased.coe.required',
      ofwLandPayslip: 'vehiclePurchased.ofwLandBased.payslip.required',
      ofwLandRemittance: 'vehiclePurchased.ofwLandBased.remittance.required',
      ofwSeaCOE: 'vehiclePurchased.ofwSeaBased.coe.required',
      ofwSeaPayslip: 'vehiclePurchased.ofwSeaBased.payslip.required',
      ofwSeaAllotment: 'vehiclePurchased.ofwSeaBased.allotment.required',
      ofwSeaTip: 'vehiclePurchased.ofwSeaBased.tip.required',
      ofwSeaVoucher: 'vehiclePurchased.ofwSeaBased.voucher.required',
      returnReason: 'returnReason',
      local: 'vehiclePurchased.local',
      ofwLandBased: 'vehiclePurchased.ofwLandBased',
      ofwSeaBased: 'vehiclePurchased.ofwSeaBased',
      type: 'vehiclePurchased.type',
      status: 'status'
    }),
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    },
    returnRoute () {
      const superUserBankReturn = this.$s.userRole.includes('superUser') && this.status !== 'submitted'
      const route = this.$s.userRole.includes('bankApprover') || superUserBankReturn ? 'bankReturn' : 'return'
      return route
    }
  },
  methods: {
    async returnApplication () {
      this.$store.dispatch('showDialog', {
        title: 'Return application?',
        message: 'This will return the specific application.',
        buttonLabel: 'Return',
        callback: async () => {
          this.crudFormMethods.loading = true
          this.editable = false
          const route = this.returnRoute
          const resp = await this.crudFormMethods.api(route).update('', {
            local: this.local,
            ofwLandBased: this.ofwLandBased,
            ofwSeaBased: this.ofwSeaBased,
            returnReason: this.returnReason
          })
          if (resp.ok) {
            this.dialog = false
            this.crudFormMethods.$store.dispatch('showAlert', {
              message: (await resp.json()).message,
              type: 'success'
            })
            this.crudFormMethods.view()
          } else {
            this.dialog = false
            this.crudFormMethods.$store.dispatch('showAlert', {
              message: (await resp.json()).message.errors,
              type: 'error'
            })
          }
          this.editable = false
          this.crudFormMethods.loading = false
        }
      })
    }
  }
}
</script>
