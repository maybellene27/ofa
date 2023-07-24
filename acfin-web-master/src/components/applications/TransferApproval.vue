<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card
            class="pa-5"
            :loading="crudFormMethods.loading"
          >
            <v-row>
              <v-col class="d-flex justify-center">
                <div>
                  <b>Transfer Approval</b>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                This will transfer the approval to other branches. Kindly select among the choices below:
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <LookUpSelect
                  id="companies"
                  v-model="company"
                  name="company"
                  item-text="name"
                  item-value="_id"
                  label="Companies"
                  text-field-class="required-field"
                  :is-dense="false"
                  :outlined="!crudFormMethods.loading"
                  :can-edit="!crudFormMethods.loading"
                  :loading="crudFormMethods.loading"
                  @change="() => {
                    branch = ''
                  }"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <LookUpSelect
                  id="branches"
                  v-model="branch"
                  name="branch"
                  item-text="name"
                  label="Branch"
                  :loading="crudFormMethods.loading"
                  :query="{ company }"
                  text-field-class="required-field"
                  :is-dense="false"
                  :outlined="!crudFormMethods.loading"
                  :can-edit="!crudFormMethods.loading"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p>Cancellation Letter</p>
                <div
                  class="d-flex"
                >
                  <v-file-input
                    id="cancellationLetter"
                    v-model="cancellationLetter"
                    class="required-field"
                    outlined
                    label="(file size must be less than 3 mb)"
                    small-chips
                    deletable-chips
                    :clearable="true"
                  >
                    <template v-slot:selection="{ index, text, file }">
                      <v-chip
                        close
                        color="primary"
                        @click:close="deleteChip(index)"
                      >
                        {{ text || file.originalname }}
                      </v-chip>
                    </template>
                  </v-file-input>
                  <v-btn
                    v-if="cancellationLetter"
                    icon
                    class="mt-3"
                    @click="downloadFile('cancellationLetter')"
                  >
                    <v-icon>
                      mdi-download
                    </v-icon>
                  </v-btn>
                </div>
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
                  @click="transferApproval()"
                >
                  Transfer
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
import { LookUpSelect } from 'maroon-vue-components'
import { mapFields } from 'vuex-map-fields'
import fileInputMixin from '@/mixins/fileInputMixin'
import { downloadFile } from '@/utils/helpers'

export default {
  name: 'ReturnDialog',
  components: {
    LookUpSelect
  },
  mixins: [fileInputMixin],
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
    company: '',
    branch: ''
  }),
  computed: {
    ...mapFields('application', {
      previousBranch: 'vehiclePurchased.branch',
      cancellationLetter: 'cancellationLetter'
    }),
    ...mapFields('masterData', {
      branches: 'branch'
    }),
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    },
    getDefaultCompany () {
      let defaultCompany = ''
      this.branches.forEach((x) => {
        if (x._id === this.previousBranch) {
          defaultCompany = x.company
        }
      })
      return defaultCompany
    }
  },
  watch: {
    getDefaultCompany: {
      handler (obj) {
        this.company = obj
      },
      deep: true
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['branch'])
  },
  async created () {
    await this.$store.dispatch('masterData/initOpts', { mds: ['branch'] })
  },
  methods: {
    transferApproval () {
      this.$store.dispatch('showDialog', {
        title: 'Transfer approval for application?',
        message: 'This will transfer the approval of specific application.',
        buttonLabel: 'Transfer',
        callback: async () => {
          this.crudFormMethods.loading = true
          const resp = await this.crudFormMethods.api('transfer').update('', {
            branch: this.branch,
            previousBranch: this.previousBranch
          })
          if (resp.ok) {
            const fileResp = await this.fileUpload()
            if (!fileResp.ok) {
              this.dialog = false
              this.crudFormMethods.$store.dispatch('showAlert', {
                message: (await fileResp.json()).message.errors,
                type: 'error'
              })
            }
            this.dialog = false
            this.crudFormMethods.$store.dispatch('showAlert', {
              message: (await resp.json()).message,
              type: 'success'
            })
            this.$router.push({
              name: 'ApplicationTable'
            })
          } else {
            this.dialog = false
            this.crudFormMethods.$store.dispatch('showAlert', {
              message: (await resp.json()).message.errors,
              type: 'error'
            })
          }
          this.crudFormMethods.loading = false
        }
      })
    },
    async fileUpload () {
      const form = new FormData()
      form.append('cancellationLetter', this.cancellationLetter)
      const resp = await this.crudFormMethods.api('cancelLetterForm').createForm(form, {}, this.$route.params.id, 'cancellationLetter')
      return resp
    },
    downloadFile (key) {
      if (this[key].name) {
        downloadFile(this[key], this[key].name)
      } else {
        this.download(`attachment/application/${this.$route.params.id}`, this[key])
      }
    }
  }
}
</script>
