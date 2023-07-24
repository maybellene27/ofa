<template>
  <v-container>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        width="800px"
      >
        <v-card>
          <v-btn
            icon
            color="red"
            @click="dialog = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          <v-card-title
            class="d-flex justify-center mb-5 text-decoration-underline font-weight-bold"
          >
            <span class="text-h5">Consent Clause</span>
          </v-card-title>
          <v-divider />
          <v-card-text
            class="my-5"
          >
            <v-row
              justify="center"
              class="mx-5"
            >
              <v-col
                cols="12"
                sm="12"
                md="12"
                align="justify"
              >
                <div class="pb-3">
                  <p>
                    I hereby give full consent to {{ companyName }} (the "Company"), its authorized
                    representatives, dealerships, and agents to collect, record, organize, store, update, share, use,
                    consolidate, block, erase, or otherwise process information, whether personal, sensitive, or
                    privileged, pertaining to myself and the transactions subject hereof pursuant to the provisions of
                    the Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and regulations.
                  </p>
                </div>
                <div>
                  <p>
                    I confirm that my personal information may be used by the Company for the following purpose:
                  </p>
                  <ol>
                    <li>Quality Assurance, including callouts for products and service satisfaction purposes;</li>
                    <li>Warranty, including notices for recalls and service campaigns;</li>
                    <li>
                      Research, including update of records, invitation to focus group discussions, surveys,
                      satisfaction, indexing, and similar studies; and,
                    </li>
                    <li>Marketing, including promotional offers for services, parts, and new vehicle introductions.</li>
                  </ol>
                </div>
                <div class="pb-3">
                  <p>
                    I confirm that I have placed a check mark beside the relevant provisions below to indicate my
                    consent to the following processing of my personal information and the corresponding declared purposes thereof:
                  </p>
                  <p>
                    - Endorsement of my personal information to Accredited Banks* and Financial Institutions in
                    order for the latter to market their car loan products and offers in connection with the bank
                    financing of my purchase of the vehicle.
                  </p>
                </div>
                <div class="pb-3">
                  <p>*Accredited Banks and Financial Institutions pertain to the following chosen institutions and their affliates:</p>
                </div>
                <div class="pb-3">
                  <p>(Unless otherwise indicated, you consent to the endorsement of your personal information to all of the foregoing banking and financial institurions.)</p>
                </div>
                <p>
                  The consent and authorization will remain valid throughout the existence of my account(s) unless
                  withdrawn in writing or withheld due to changes of information given by the company.
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                sm="4"
                md="4"
                cols="12"
              >
                <v-file-input
                  id="uploadBorrowerSign"
                  v-model="borrowerSignature"
                  accept="image/*"
                  label="Upload Borrower Signature"
                  small-chips
                  :disabled="!editable"
                  :clearable="true"
                  @change="() => date = new Date().toISOString().substr(0, 10)"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip
                      color="primary"
                    >
                      {{ text || 'File uploaded' }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col
                sm="4"
                md="4"
                cols="12"
              >
                <v-file-input
                  id="uploadSpouseSign"
                  v-model="spouseSignature"
                  accept="image/*"
                  label="Upload Spouse Signature"
                  small-chips
                  :disabled="!editable"
                  :clearable="true"
                  @change="() => date = new Date().toISOString().substr(0, 10)"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip
                      color="primary"
                    >
                      {{ text || 'File uploaded' }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                sm="4"
                md="4"
                cols="12"
              >
                <SignaturePad
                  id="borrowerSignature"
                  button-title="Signature of Borrower"
                  file-name="borrowerSignature.png"
                  @saveSignature="(obj) => {
                    saveSignature(obj, 'borrowerSignature')
                  }"
                />
                <v-chip
                  v-if="borrowerSignature"
                  outlined
                  class="ml-3"
                  @click="() => {
                    downloadFile('borrowerSignature')
                  }"
                >
                  <v-icon left>
                    mdi-download
                  </v-icon>
                  <span>{{ signatureDisplay('borrowerSignature') }}</span>
                </v-chip>
              </v-col>
              <v-col
                md="4"
                sm="4"
                cols="12"
              >
                <SignaturePad
                  id="spouseSignature"
                  file-name="spouseSignature.png"
                  button-title="Signature of Spouse"
                  @saveSignature="(obj) => {
                    saveSignature(obj, 'spouseSignature')
                  }"
                />
                <v-chip
                  v-if="spouseSignature"
                  outlined
                  class="ml-3"
                  @click="() => {
                    downloadFile('spouseSignature')
                  }"
                >
                  <v-icon left>
                    mdi-download
                  </v-icon>
                  <span>{{ signatureDisplay('spouseSignature') }}</span>
                </v-chip>
              </v-col>
              <v-col
                md="4"
                sm="4"
                cols="12"
                class="mt-3"
              >
                <DateComponent
                  v-model="date"
                  :value="date"
                  label="Date"
                  :outlined="false"
                  :disabled="true"
                  :is-dense="true"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Disagree
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="agree()"
            >
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import SignaturePad from '@/components/applications/SignaturePad'
import { downloadFile } from '@/utils/helpers'
import { DateComponent } from 'maroon-vue-components'
import fileInputMixin from '@/mixins/fileInputMixin'
import { mapFields } from 'vuex-map-fields'
import crud from '@/rest/crud'

export default {
  name: 'ConsentClause',
  components: {
    SignaturePad,
    DateComponent
  },
  mixins: [fileInputMixin],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    branch: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    branchName: ''
  }),
  computed: {
    ...mapFields('application', {
      borrowerSignature: 'vehiclePurchased.borrowerSignature',
      spouseSignature: 'vehiclePurchased.spouseSignature',
      date: 'vehiclePurchased.date'
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
    brandState () {
      return this.brand || ''
    },
    branchMeta () {
      return this.branch
    },
    companyName () {
      return this.iterateBranchCompany(this.brandState, this.branchName)
    }
  },
  async created () {
    await this.getBranchName()
  },
  methods: {
    async getBranchName () {
      if (this.branchMeta) {
        const response = await crud('branch').read(this.branchMeta)
        const { name } = response.entry
        this.branchName = name
      }
    },
    agree () {
      this.$emit('agree', true)
      this.dialog = false
    },
    signatureDisplay (key) {
      let display = ''
      if (this[key]) {
        if (this[key].name) {
          display = this[key].name
        } else {
          const isArray = Array.isArray(this[key])
          if (isArray) {
            this[key].forEach((x) => {
              display = x.filename
            })
          }
        }
      }
      return display
    },
    saveSignature (obj, key) {
      this.date = new Date().toISOString().substr(0, 10)
      this[key] = obj
    },
    downloadFile (key) {
      if (this[key].name) {
        downloadFile(this[key], this[key].name)
      } else {
        this.download(`attachment/application/${this.$route.params.id}`, this[key])
      }
    },
    iterateBranchCompany (brand, branch) {
      const autoCom = {
        Honda: `${brand} Cars ${branch}, Inc.`,
        Isuzu: `${brand} Automotive Dealership, Inc.`,
        KIA: `${brand} Motor, Inc.`,
        KTM: `${brand} Asia Motorcycle Manufacturing, Inc.`,
        Maxus: `${brand} Automotive Co., Ltd.`,
        Volkswagen: `${brand} AG`
      }
      return autoCom[brand]
    }
  }
}
</script>
