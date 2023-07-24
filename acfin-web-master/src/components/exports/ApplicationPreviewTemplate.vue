<template>
  <div>
    <v-container
      class="fluid font"
      style="width: 98%;"
    >
      <div
        class="header"
      >
        <div
          class="logo"
        >
          <v-img
            :src="logo && logo.length ? logo : null"
            height="50"
            width="150"
          />
        </div>
        <div
          class="header-title"
        >
          <div
            class="title"
          >
            {{ branchName }}
          </div>
          <div
            class="caption"
          >
            {{ branch && branch.address }}
            <br> {{ `${branch && branch.telephone} | ${branch && branch.mobile}` }} | {{ branch && branch.email }}
          </div>
        </div>
      </div>
      <div
        class="form-label-main"
      >
        Auto Loan Application for Individual and Single Proprietorship
      </div>
      <div
        class="form-label"
      >
        APPLICANT
      </div>
      <ApplicantForm
        :data="applicant"
      />
      <div>
        <div
          class="form-label"
        >
          SPOUSE/CO-MAKER
        </div>
        <div
          v-for="(content, index) in coMaker"
          :key="index"
        >
          <!-- <div
            style="font-size: 12px; margin-top: 5px"
          >
            Spouse/Co-Maker {{ index+1 }}:
          </div> -->
          <div
            style="display: flex"
          >
            <div
              style="margin-top: 5px; font-size: 12px"
            >
              Spouse/Co-Maker {{ index+1 }}:
            </div>
            <div
              v-if="!!content.relationship"
              style="width: 20%; margin-left: 10px; margin-top: 5px;"
            >
              <div
                style="font-size: 12px; text-align: center"
              >
                {{ content.relationship || 'n/a' }}
              </div>
              <div
                class="caption-2"
              >
                Relationship
              </div>
            </div>
          </div>
          <CoMakerForm
            :data="content"
          />
        </div>
      </div>
      <div
        style="page-break-inside: avoid"
      >
        <div
          class="form-label"
        >
          EMPLOYMENT
        </div>
        <EmploymentForm
          :applicant="applicantEmployment"
          :spouse="spouseEmployment"
        />
      </div>
      <div
        style="page-break-inside: avoid"
      >
        <div
          class="form-label"
        >
          MOTOR VEHICLE TO BE PURCHASED
        </div>
      </div>
      <MotorVehicleForm
        :data="vehiclePurchased"
      />
      <v-container
        style="page-break-inside: avoid"
      >
        <div
          class="form-label-consent"
        >
          <div
            style="width: 25%; text-align: center;"
          >
            AGREEMENT
          </div>
          <div
            style="width: 70%; text-align: center"
          >
            CONSENT CLAUSE
          </div>
        </div>
        <AgreementForm
          :borrower-signature="borrowerSignatureImg"
          :spouse-signature="spouseSignatureImg"
          :vehicle-purchased="vehiclePurchased"
          :company-name="companyName"
          :bank-list="bankListFiltered"
        />
      </v-container>
    </v-container>
  </div>
</template>

<script>
import ApplicantForm from './applicationPreviewForms/ApplicantForm'
import CoMakerForm from './applicationPreviewForms/CoMakerForm'
import EmploymentForm from './applicationPreviewForms/EmploymentForm'
import MotorVehicleForm from './applicationPreviewForms/MotorVehicleForm'
import AgreementForm from './applicationPreviewForms/AgreementForm'
import fileInputMixin from '@/mixins/fileInputMixin'
import crud from '@/rest/crud'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ApplicationPreviewTemplate',
  components: {
    ApplicantForm,
    CoMakerForm,
    EmploymentForm,
    MotorVehicleForm,
    AgreementForm
  },
  mixins: [
    fileInputMixin
  ],
  props: {
    pdfData: {
      type: Object,
      default: () => {}
    },
    bankStatus: {
      type: String,
      default: ''
    },
    bank: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    borrowerSignatureImg: '',
    spouseSignatureImg: '',
    branch: {},
    branchName: '',
    companyName: '',
    logo: []
  }),
  computed: {
    ...mapFields('masterData', {
      bankList: 'financingPartner',
      bankListIsLoading: 'financingPartnerIsLoading'
    }),
    bankId () {
      return this.$route.params.bankId
    },
    id () {
      return this.$route.params.id
    },
    data () {
      return this.pdfData && this.pdfData.result && this.pdfData.result.length && this.pdfData.result[0]
    },
    applicant () {
      return this.data && this.data.applicant
    },
    coMaker () {
      return this.data && this.data.spouse
    },
    applicantEmployment () {
      return this.data && this.data.applicantEmployment
    },
    spouseEmployment () {
      return this.data && this.data.spouseEmployment
    },
    vehiclePurchased () {
      return this.data && this.data.vehiclePurchased
    },
    bankListFiltered () {
      const id = this.pdfData && this.pdfData.entry && this.pdfData.entry.vehiclePurchased && this.pdfData.entry.vehiclePurchased.branch
      return this.bankList.filter((x) => {
        if ((x.brand && x.brand.includes(this.data.vehiclePurchased.brand)) && (x.branch && x.branch.includes(id))) {
          return x
        }
      })
    }
  },
  async created () {
    await this.getBranch()
    this.borrowerSignatureImg = this.data && this.data.vehiclePurchased ? await this.imageContent(this.data && this.data.vehiclePurchased && this.data.vehiclePurchased.borrowerSignature) : ''
    this.spouseSignatureImg = this.data && this.data.vehiclePurchased ? await this.imageContent(this.data && this.data.vehiclePurchased && this.data.vehiclePurchased.spouseSignature) : ''
  },
  methods: {
    async getBranch () {
      const id = this.pdfData && this.pdfData.entry && this.pdfData.entry.vehiclePurchased && this.pdfData.entry.vehiclePurchased.branch
      if (id) {
        const resp = await crud('branch').read(id, 'read')
        const data = await resp
        this.branch = data.entry
        this.branchName = data.entry.name.toUpperCase()
        this.companyName = data.entry && data.entry.companyData.name
        const companyId = data.entry.companyData._id
        const logoImage = this.branch && this.branch.companyData && this.branch.companyData.logo
        this.logo = await this.getLogo(logoImage, companyId, 'company')
      }
    },
    async imageContent (content) {
      const model = this.bankStatus ? 'bankApplication' : 'application'
      const id = this.bankId ? this.bankId : this.id
      if (content) {
        const url = `attachment/${model}/${id}`
        const files = [content]
        const resp = await crud(`${url}/${files[0].fieldname}/${files[0].filename}`).get()
        const data = await resp.json()
        return data.file
      }
    },
    async getLogo (content = [], id, model) {
      if (content && content.length) {
        const url = `attachment/${model}/${id}`
        const files = content
        const resp = await crud(`${url}/${files[0].fieldname}/${files[0].filename}`).get()
        const data = await resp.json()
        return data.file
      }
    }
  }
}
</script>
<style scoped>
  .font {
    font-family: Arial, Helvetica, sans-serif;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
  }
  /* .header .logo {
    width: 20%;
  } */
  .header .header-title {
    display: flex;
    width: 65%;
    flex-direction: column;
    justify-content: flex-end;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
  }
  .caption {
    font-size: 9px;
    font-weight: bold;
  }
  .form-label-main {
    background-color: red;
    height: 20px;
    margin-top: 10px;
    color: white;
    font-size: 12px;
    text-align: center;
    padding-top: 1px;
    font-weight: bold;
  }
  .form-label {
    background-color: gainsboro;
    height: 20px;
    margin-top: 5px;
    font-size: 12px;
    text-align: center;
    font-weight: bold;
    border-style: solid
  }
  .form-label-consent {
    background-color: gainsboro;
    height: 20px;
    margin-top: 5px;
    font-size: 12px;
    font-weight: bold;
    border-style: solid;
    display: flex;
  }
  .caption-2 {
    font-size: 7px;
    font-weight: bold;
    border-top: 1px solid;
    text-align: center;
  }
</style>
