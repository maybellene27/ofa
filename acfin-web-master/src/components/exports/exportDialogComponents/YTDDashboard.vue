<template>
  <v-container>
    <v-row>
      <v-col>
        This will export the specific report of Partner Banks Performance.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Please provide the following details to proceed.
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-col
        class="d-flex justify-center"
      >
        <v-radio-group
          id="ytdChoice"
          v-model="ytdChoice"
          mandatory
        >
          <template v-slot:label>
            <div><strong>YTD Choices: </strong></div>
          </template>
          <v-radio
            v-for="item in ['YTD Turn-Around Time', 'YTD Application Status', 'YTD Bank Status']"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <DateComponent
          id="ytdYear"
          v-model="ytdYear"
          :no-title="true"
          placeholder="YYYY"
          label="Year"
          :max="dateToday"
          :value="ytdYear"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-autocomplete
          id="ytdCompany"
          v-model="company"
          class="required-field"
          label="Companies"
          :items="companyList"
          item-text="name"
          item-value="_id"
          small-chips
          :outlined="true"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="ytdChoice === 'YTD Bank Status'"
    >
      <v-col>
        <v-autocomplete
          id="branchFilter"
          v-model="branchFilter"
          class="required-field"
          label="Branch"
          :items="filteredBranch"
          item-text="name"
          item-value="_id"
          small-chips
          :outlined="true"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="ytdChoice === 'YTD Bank Status'"
    >
      <v-col>
        <v-autocomplete
          id="banks"
          v-model="bank"
          class="required-field"
          label="Banks"
          :items="filteredBanks"
          item-text="name"
          item-value="_id"
          small-chips
          :outlined="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group
          id="ytdChoiceFilter"
          v-model="ytdChoiceFilter"
          mandatory
          @change="() => {
            ytdBranch = ''
            ytdBrand = ''
          }"
        >
          <template v-slot:label>
            <div><strong>Choice Filter: </strong></div>
          </template>
          <v-radio
            v-for="item in ['No Additional Filter', 'Branch', 'Brand']"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row
      v-if="ytdChoiceFilter === 'Branch'"
    >
      <v-col>
        <v-select
          id="ytdBranch"
          v-model="ytdBranch"
          :items="filteredBranch"
          label="Branch"
          item-text="name"
          item-value="_id"
          dense
          small-chips
          :outlined="true"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="ytdChoiceFilter === 'Brand'"
    >
      <v-col>
        <v-select
          id="ytdBrand"
          v-model="ytdBrand"
          :items="brands"
          label="Brand"
          dense
          small-chips
          :outlined="true"
        />
      </v-col>
    </v-row>
    <div style="display:none;">
      <component
        :is="component"
        :id="component"
        :table-content="contentData"
        :bank="bank"
        :bank-list="bankList"
      />
    </div>
    <ExportActionButton
      @action="exportReport()"
      @dialog="(obj) => {
        $emit('dialog', obj)
      }"
    />
  </v-container>
</template>
<script>
import DateComponent from '@/components/fields/DateComponent'
import ExportActionButton from '@/components/exports/exportDialogComponents/ExportActionButton'
import { mapFields } from 'vuex-map-fields'
import masterData from '@/store/masterData'
import '@/components/exports/exportTables/ytdTables'
import XLSX from 'xlsx'
import crud from '@/rest/crud'

export default {
  name: 'YTDDashboard',
  components: {
    ExportActionButton,
    DateComponent
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    ytdYear: '',
    ytdFilter: '',
    ytdChoice: 'YTD Turn-Around Time',
    ytdChoiceFilter: '',
    bank: '',
    company: '',
    ytdBranch: '',
    branchFilter: '',
    ytdBrand: '',
    contentData: {},
    component: 'ytdTurnaroundTime'
  }),
  computed: {
    ...mapFields('masterData', {
      bankList: 'financingPartner',
      bankListIsLoading: 'financingPartnerIsLoading',
      companyList: 'company',
      branchList: 'branch'
    }),
    companyName () {
      return this.companyList.filter(company => company._id === this.company)[0].name
    },
    brands () {
      return [
        'Honda',
        'Isuzu',
        'KIA',
        'KTM',
        'Maxus',
        'Volkswagen'
      ]
    },
    dateToday () {
      return new Date().toISOString()
    },
    filteredBranch () {
      return this.branchList.filter((branch) => branch.company === this.company)
    },
    filteredBanks () {
      // const selectedCompany = this.company && this.companyList.find((company) => company._id === this.company)
      // const companyIdArray = selectedCompany && selectedCompany.branches.map((branch) => {
      //   return branch._id
      // })
      const filteredBanks = this.bankList.filter((bank) => bank.branch.includes(this.branchFilter))
      return filteredBanks
    }
  },
  beforeCreate () {
    if (!this.$store.hasModule('masterData')) {
      this.$store.registerModule('masterData', masterData)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['financingPartner'])
    this.$store.dispatch('masterData/reset', ['company'])
  },
  created () {
    this.$store.dispatch('masterData/initOpts', { mds: ['financingPartner'] })
    this.$store.dispatch('masterData/initOpts', { mds: ['company'] })
    this.$store.dispatch('masterData/initOpts', { mds: ['branch'] })
  },
  methods: {
    hasSameElements (arr1, arr2) {
      const containsAll = (arr1, arr2) => arr2.some(arr2Item => arr1.includes(arr2Item))
      return containsAll(arr1, arr2) && containsAll(arr2, arr1)
    },
    checkStatus (choice) {
      const dict = {
        'YTD Turn-Around Time': 'ytdTurnaroundTime',
        'YTD Application Status': 'ytdApplicationStatus',
        'YTD Bank Status': 'ytdBankStatus'
      }
      return dict[choice]
    },
    async exportReport () {
      const status = this.checkStatus(this.ytdChoice)
      this.component = status
      await this.fetchData()
      const el = document.getElementById(this.component)
      const wb = XLSX.utils.table_to_book(el)
      XLSX.writeFile(wb, `${status}.xlsx`)
    },
    async fetchData () {
      const resp = await crud('export/report/bankApplication').create({
        reportType: this.checkStatus(this.ytdChoice),
        company: this.company,
        year: this.ytdYear,
        bank: this.bank,
        filter: {
          branch: this.ytdBranch,
          brand: this.ytdBrand
        }
      })
      const data = await resp.json()
      this.contentData = data.result && data.result[0]
    }
  }
}
</script>
