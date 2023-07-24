<template>
  <v-container class="text-format">
    <ExportHeader />
    <template v-if="form">
      <p class="text-center loan-text font-bold">
        {{ form.title }}
      </p>
      <div
        v-for="(row, i) in form.data"
        :key="i"
      >
        <template v-if="row.title === 'APPLICANT'">
          <p class="text-center font-bold title">
            {{ row.title }}
          </p>
          <div class="flex-start">
            <b>Applicant: </b>
            <table>
              <tr>
                <td class="space-side">
                  {{ row.items.lastName }},
                </td>
                <td class="space-side">
                  {{ row.items.firstName }}
                </td>
                <td class="space-side">
                  {{ row.items.middleName }}
                </td>
              </tr>
              <tr class="underline" />
              <tr>
                <td class="space-side">
                  <small>
                    last name
                  </small>
                </td>
                <td class="space-side">
                  <small>
                    first name
                  </small>
                </td>
                <td class="space-side">
                  <small>
                    middle name
                  </small>
                </td>
              </tr>
            </table>
            <div class="flex-start space">
              <b>Age: </b>
              <p class="space">
                {{ row.items.age }}
              </p>
            </div>
            <div class="flex-start">
              <b>Birthday: </b>
              <p class="space">
                {{ row.items.birthday }}
              </p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div style="display: flex; flex-direction: row">
              <b style="margin-right: .3rem">TIN:</b>
              <p>{{ row.items.tin }}</p>
            </div>
            <div style="display: flex; flex-direction: row">
              <b style="margin-right: .3rem">Tel. No.:</b>
              <p>{{ row.items.telNo }}</p>
            </div>
            <div style="display: flex; flex-direction: row">
              <b style="margin-right: .3rem">Mobile No.:</b>
              <p>{{ row.items.mobileNo }}</p>
            </div>
            <div style="display: flex; flex-direction: row">
              <b style="margin-right: .3rem">Email Address: &nbsp;</b>
              <p>{{ row.items.email }}</p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div>
              <b>Marital Status: </b>
            </div>
            <div
              v-for="(item, index) in objName(maritalStatus)"
              :key="index"
              class="flex-around"
            >
              <div class="flex-start space">
                <input
                  :id="maritalStatus[item]"
                  type="radio"
                  name="marital_status"
                  :checked="item === row.items.maritalStatus"
                  :value="item"
                >
                <label
                  class="space"
                  :for="maritalStatus[item]"
                >{{ item }}</label>
              </div>
            </div>
            <div class="flex-start space">
              <b>Citizenship: </b>
              <p class="space">
                {{ row.items.citizenShip }}
              </p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div>
              <b>Present Address: </b>
              <p class="space underline">
                {{ row.items.presentAddress }}
              </p>
            </div>
            <div class="space">
              <b>Length of Stay: </b>
              <p class="space underline">
                {{ row.items.presentLengthOfStay }}
              </p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div>
              <b>Ownership: </b>
            </div>
            <div
              v-for="(item, index) in objName(ownerShip)"
              :key="index"
              class="flex-around"
            >
              <div class="flex-start space">
                <input
                  :id="ownerShip[item]"
                  type="radio"
                  name="ownership"
                  :checked="item === row.items.ownerShip"
                  :value="item"
                >
                <label
                  class="space"
                  :for="ownerShip[item]"
                >{{ item }}</label>
              </div>
            </div>
            <div class="flex-start space">
              <b>No. of Dependents: </b>
              <p class="space">
                {{ row.items.dependents }}
              </p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div>
              <b>Previous Address: </b>
              <p class="space underline">
                {{ row.items.previousAddress }}
              </p>
            </div>
            <div class="space">
              <b>Length of Stay: </b>
              <p class="space underline">
                {{ row.items.previousLengthOfStay }}
              </p>
            </div>
          </div>
        </template>
        <template v-if="row.title === 'SPOUSE/CO-MAKER'">
          <p class="text-center font-bold title">
            {{ row.title }}
          </p>

          <div class="flex-start">
            <b>Spouse: </b>
            <table>
              <tr>
                <td class="space-side">
                  {{ row.items.lastName }},
                </td>
                <td class="space-side">
                  {{ row.items.firstName }}
                </td>
                <td class="space-side">
                  {{ row.items.middleName }}
                </td>
              </tr>
              <tr class="underline" />
              <tr>
                <td class="space-side">
                  <small>
                    last name
                  </small>
                </td>
                <td class="space-side">
                  <small>
                    first name
                  </small>
                </td>
                <td class="space-side">
                  <small>
                    middle name
                  </small>
                </td>
              </tr>
            </table>
            <div class="flex-start space">
              <b>Age: </b>
              <p class="space">
                {{ row.items.age }}
              </p>
            </div>
            <div class="flex-start">
              <b>Birthday: </b>
              <p class="space">
                {{ row.items.birthday || "" }}
              </p>
            </div>
          </div>

          <div class="flex-between space-top">
            <div>
              <b>TIN: </b>
              <p>{{ row.items.tin }}</p>
            </div>
            <div>
              <b>Tel. No.: </b>
              <p>{{ row.items.telNo }}</p>
            </div>
            <div>
              <b>Mobile No.: </b>
              <p>{{ row.items.mobileNo }}</p>
            </div>
            <div>
              <b>Email Address: </b>
              <p>{{ row.items.email }}</p>
            </div>
          </div>
        </template>
        <template v-if="row.title === 'EMPLOYMENT'">
          <p class="text-center font-bold title">
            {{ row.title }}
          </p>

          <v-row>
            <template v-for="(item, count) in row.items">
              <v-col
                :key="count"
                cols="6"
              >
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>{{ count === 0 ? 'Applicant' : 'Spouse / Co-maker' }}: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.type }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Emp / Bus Name: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.name }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Address: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.address }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Position: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.position }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Tel. No.: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.telephone }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Years: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.years }} </p>
                  </v-col>
                </v-row>
                <v-row class="ma-0">
                  <v-col cols="6">
                    <b>Monthly Income: </b>
                  </v-col>
                  <v-col cols="6">
                    <p>{{ item.monthlyIncome }} </p>
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </template>
        <template v-if="row.title === 'MOTOR VEHICLE TO BE PURCHASED'">
          <p class="text-center font-bold title">
            {{ row.title }}
          </p>

          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <b>Unit / Model / Year: </b>
                </v-col>
                <v-col cols="6">
                  <p>
                    {{
                      `${row.items.unit} / ${row.items.model} / ${row.items.year}`
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <b>Selling Price: </b>
                </v-col>
                <v-col cols="6">
                  <p>{{ row.items.sellingPrice }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <b>Amount Financed: </b>
                </v-col>
                <v-col cols="6">
                  <p>{{ row.items.amountFinanced }}</p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <b>Downpayment: [ {{ row.items.downpayment }} %] </b>
                </v-col>
                <v-col cols="6">
                  <p>{{ row.items.downpayment }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <div class="flex-between space-top">
            <div>
              <b>Terms: </b>
            </div>
            <div class="flex-around">
              <template v-for="(item, key) in terms">
                <div
                  :key="key"
                  class="flex-start space"
                >
                  <input
                    :id="item"
                    type="radio"
                    name="terms"
                    :checked="item === row.items.term"
                    :value="item"
                  >
                  <label
                    class="space"
                    :for="item"
                  >{{ item }}</label>
                </div>
              </template>
            </div>
            <div class="flex-start space">
              <b>Sales Executive: </b>
              <p class="space">
                {{ row.items.salesExecutive || "" }}
              </p>
            </div>
          </div>
          <v-row style="margin-top: '150px'; page-break-inside: avoid">
            <v-col cols="4">
              <p class="text-center title font-bold">
                AGREEMENT
              </p>
              <p class="text-justify">
                I/We hereby certify that all data and statements in this application are correct and complete, and
                are made for the purpose of obtaining credit and the signatures appearing hereon are genuine.
                I/We authorize you to obtain such information as you may require concerning the statements made in this
                application and that the sources from which you may verify are authorized to provide any information relative
                to this application. I agree that the application may remain your property whether the credit is granted or not.
              </p>
              <img
                :src="borrowerSignatureImg || null"
                width="250"
                height="150"
              >
              <p class="underline-top">
                Signature of the Borrower
              </p>
              <img
                :src="spouseSignatureImg || null"
                width="250"
                height="150"
              >
              <p class="underline-top padding-bottom">
                Signature of the Spouse/Co-maker
              </p>
              <p>{{ row.items.signatureDate }}</p>
              <p class="underline-top">
                Date Signed
              </p>
            </v-col>
            <v-col cols="8">
              <p class="text-center title font-bold">
                CONSENT CLAUSE
              </p>
              <div class="padding-bottom">
                <p class="text-justify">
                  I hereby give full consent to {{ row.items.companyName }} (the "Company"), its authorized
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
                <ol class="padding-bottom space-side">
                  <li>Quality Assurance, including callouts for products and service satisfaction purposes;</li>
                  <li>Warranty, including notices for recalls and service campaigns;</li>
                  <li>
                    Research, including update of records, invitation to focus group discussions, surveys,
                    satisfaction, indexing, and similar studies; and,
                  </li>
                  <li>Marketing, including promotional offers for services, parts, and new vehicle introductions.</li>
                </ol>
              </div>
              <div class="padding-bottom">
                <p class="text-justify">
                  I confirm that I have placed a check mark beside the relevant provisions below to indicate my
                  consent to the following processing of my personal information and the corresponding declared purposes thereof:
                </p>
                <p class="text-justify">
                  - Endorsement of my personal information to Accredited Banks* and Financial Institutions in
                  order for the latter to market their car loan products and offers in connection with the bank
                  financing of my purchase of the vehicle.
                </p>
              </div>
              <div class="padding-bottom">
                <p>*Accredited Banks and Financial Institutions pertain to the following chosen institutions and their affliates:</p>
                <div
                  v-for="(item, bankCount) in row.items.banks"
                  :key="bankCount"
                  class="space-side"
                >
                  <input
                    :id="item"
                    type="checkbox"
                    name="banks"
                    checked
                    :value="item"
                  >
                  <label
                    class="space"
                    :for="item"
                  >{{ item }}</label>
                </div>
              </div>
              <div class="padding-bottom">
                <p class="text-justify">
                  (Unless otherwise indicated, you consent to the endorsement of your personal information to all of the foregoing banking and financial institurions.)
                </p>
              </div>
              <p class="text-justify">
                The consent and authorization will remain valid throughout the existence of my account(s) unless
                withdrawn in writing or withheld due to changes of information given by the company.
              </p>
              <v-row>
                <v-col cols="4">
                  <img
                    :src="borrowerSignatureImg || null"
                    width="150"
                    height="100"
                  >
                  <p class="underline-top">
                    Signature of the Borrower
                  </p>
                </v-col>
                <v-col cols="4">
                  <img
                    :src="spouseSignatureImg || null"
                    width="150"
                    height="100"
                  >
                  <p class="underline-top padding-bottom">
                    Signature of the Spouse/Co-maker
                  </p>
                </v-col>
                <v-col cols="4">
                  <p :style="{'margin-top':'100px'}">
                    {{ row.items.signatureDate }}
                  </p>
                  <p class="underline-top">
                    Date Signed
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </div>
    </template>
  </v-container>
</template>

<script>
import ExportHeader from './ExportHeader'
import exportPDFMixin from '../../mixins/exportPDFMixin'
import fileInputMixin from '@/mixins/fileInputMixin'
import crud from '@/rest/crud'

export default {
  name: 'ApplicationFormTemplate',
  components: {
    ExportHeader
  },
  mixins: [
    exportPDFMixin,
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
    maritalStatus: {
      Single: 'single',
      Married: 'married',
      Separated: 'separated',
      'Widow/er': 'window'
    },
    ownerShip: {
      Owned: 'owned',
      Mortgage: 'mortgage',
      Rented: 'rented',
      'Used Free': 'used free'
    },
    employment: {
      Employment: 'employment',
      Business: 'business'
    },
    terms: ['12', '24', '36', '48', '60']
  }),
  computed: {
    dataPDF () {
      return this.pdfData
    },
    result () {
      return this.dataPDF.result[0]
    },
    id () {
      return this.result._id
    },
    applicant () {
      return this.result.applicant
    },
    applicantEmployment () {
      return this.result.applicantEmployment
    },
    spouse () {
      return this.result.spouse
    },
    spouseEmployment () {
      return this.result.spouseEmployment
    },
    vehiclePurchased () {
      return this.result.vehiclePurchased
    },
    form () {
      return {
        title: 'Auto Loan Application for Individual and Single Proprietorship',
        data: [
          {
            title: 'APPLICANT',
            items: {
              lastName: this.applicant && this.applicant.lastName,
              firstName: this.applicant && this.applicant.firstName,
              middleName: this.applicant && this.applicant.middleName,
              age: this.applicant && this.applicant.age,
              birthday: this.applicant && this.applicant.birthday,
              tin: this.applicant && this.applicant.tin,
              telNo: this.applicant && this.applicant.telephone,
              mobileNo: this.applicant && this.applicant.mobile,
              email: this.applicant && this.applicant.email,
              maritalStatus: this.applicant && this.applicant.maritalStatus,
              citizenShip: this.applicant && this.applicant.citizenship,
              presentAddress: this.applicant && this.applicant.presentAddress.name,
              presentLengthOfStay: this.applicant && this.applicant.presentAddress.lengthOfStay,
              ownerShip: this.applicant && this.applicant.presentAddress.ownership,
              dependents: this.applicant && this.applicant.presentAddress.noOfDependents,
              previousAddress: this.applicant && this.applicant.previousAddress.name,
              previousLengthOfStay: this.applicant && this.applicant.previousAddress.lengthOfStay
            }
          },
          {
            title: 'SPOUSE/CO-MAKER',
            items: {
              lastName: this.spouse && this.spouse.lastName,
              firstName: this.spouse && this.spouse.firstName,
              middleName: this.spouse && this.spouse.middleName,
              age: this.spouse && this.spouse.age,
              birthday: this.spouse && this.spouse.birthday,
              tin: this.spouse && this.spouse.tin,
              telNo: this.spouse && this.spouse.telephone,
              mobileNo: this.spouse && this.spouse.mobile,
              email: this.spouse && this.spouse.email
            }
          },
          {
            title: 'EMPLOYMENT',
            items: [
              {
                type: this.applicantEmployment && this.applicantEmployment.type,
                name: this.applicantEmployment && this.applicantEmployment.name,
                address: this.applicantEmployment && this.applicantEmployment.address,
                position: this.applicantEmployment && this.applicantEmployment.position,
                telephone: this.applicantEmployment && this.applicantEmployment.telephone,
                years: this.applicantEmployment && this.applicantEmployment.years,
                monthlyIncome: this.applicantEmployment && this.priceFormat(this.applicantEmployment.monthlyIncome)
              },
              {
                type: this.spouseEmployment && this.spouseEmployment.type,
                name: this.spouseEmployment && this.spouseEmployment.name,
                address: this.spouseEmployment && this.spouseEmployment.address,
                position: this.spouseEmployment && this.spouseEmployment.position,
                telephone: this.spouseEmployment && this.spouseEmployment.telephone,
                years: this.spouseEmployment && this.spouseEmployment.years,
                monthlyIncome: this.spouseEmployment && this.priceFormat(this.spouseEmployment.monthlyIncome)
              }
            ]
          },
          {
            title: 'MOTOR VEHICLE TO BE PURCHASED',
            items: {
              unit: '',
              model: this.vehiclePurchased && this.vehiclePurchased.model,
              year: this.vehiclePurchased && this.vehiclePurchased.year,
              sellingPrice: this.vehiclePurchased && this.priceFormat(this.vehiclePurchased.sellingPrice),
              amountFinanced: this.vehiclePurchased && this.priceFormat(this.vehiclePurchased.amountFinance),
              downpayment: this.vehiclePurchased && this.vehiclePurchased.downpayment,
              term: this.vehiclePurchased && this.vehiclePurchased.term,
              salesExecutive: this.vehiclePurchased && this.vehiclePurchased.salesExecutive,
              banks: this.vehiclePurchased && this.vehiclePurchased.banks,
              borrowerSignature: this.vehiclePurchased && this.vehiclePurchased.borrowerSignature,
              spouseSignature: this.vehiclePurchased && this.vehiclePurchased.spouseSignature,
              signatureDate: this.vehiclePurchased && this.vehiclePurchased.date,
              companyName: this.vehiclePurchased && this.iterateBranchCompany(this.vehiclePurchased.brand, this.vehiclePurchased.branch)
            }
          }
        ]
      }
    }
  },
  async created () {
    this.borrowerSignatureImg = this.vehiclePurchased ? await this.imageContent(this.vehiclePurchased && this.vehiclePurchased.borrowerSignature) : ''
    this.spouseSignatureImg = this.vehiclePurchased ? await this.imageContent(this.vehiclePurchased && this.vehiclePurchased.spouseSignature) : ''
  },
  methods: {
    objName (obj) {
      const names = Object.getOwnPropertyNames(obj)
      const last = names[names.length - 1]
      return names.filter(name => name !== last)
    },
    priceFormat (price) {
      if (isNaN(price)) {
        return price
      }
      return Number.parseInt(price).toLocaleString('en-US', {
        style: 'currency',
        currency: 'PHP'
      })
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
    }
  }
}
</script>

<style scoped>
.text-format {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}
.loan-text {
  background-color: red;
  color: white;
  padding: 5px;
}
.title {
  margin: 7px 0px;
  background-color: rgb(186, 199, 221);
  padding: 3px;
}
.pills {
  background-color: rgb(186, 199, 221);
  padding: 5px;
  border-radius: 5px;
}
.text-center {
  text-align: center;
}
.text-justify {
  text-align: justify;
}
.padding-bottom {
  padding-bottom: 30px;
}
.space-top {
  margin-top: 15px;
}
.space {
  padding: 0px 10px;
}
.space-side {
  padding: 0px 30px;
}
.flex-around {
  display: flex;
  justify-content: space-around;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.underline-top {
  border-top: 1px solid gray;
  margin-top: 0;
}
.underline {
  border-bottom: 1px solid gray;
  margin-bottom: 0;
}
.font-bold {
  font-weight: 600;
}
</style>
