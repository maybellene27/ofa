<template>
  <v-container>
    <v-row>
      <v-col>
        This will export the specific report of Invoiced Retail.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Please provide the following details to proceed:
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-col>
        <DateComponent
          id="invoiceYear"
          v-model="invoiceYear"
          date-class="required-field"
          :no-title="true"
          placeholder="YYYY"
          label="Year"
          :max="dateToday"
          :value="invoiceYear"
          :error-messages="genericError('invoiceYear','Year')"
          @input="$v.invoiceYear.$touch()"
          @blur="$v.invoiceYear.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      class="mt-0 pt-0"
    >
      <v-col
        class="mt-0 pt-0"
      >
        <v-radio-group
          id="invoiceType"
          v-model="invoiceType"
          row
          mandatory
        >
          <template v-slot:label>
            <div><strong>Type: </strong></div>
          </template>
          <v-radio
            v-for="item in ['Bank', 'Month']"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-col>
        <v-select
          id="invoiceFilter"
          v-model="invoiceFilter"
          class="required-field"
          :items="['Company', 'Branch', 'Brand']"
          label="Filter"
          :outlined="true"
          :error-messages="genericError('invoiceFilter','Filter')"
          @input="$v.invoiceFilter.$touch()"
          @blur="$v.invoiceFilter.$touch()"
        />
      </v-col>
    </v-row>
    <div style="display: none;">
      <component
        :is="component"
        :id="component"
        :data="contentData"
        :banks="banks"
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
import crud from '@/rest/crud'
import '@/components/exports/exportTables/invoiceRetailTables'
import { mapFields } from 'vuex-map-fields'
import masterData from '@/store/masterData'
import XLSX from 'xlsx'
import { validationMixin, validationErrors } from '@/utils/validations'
import { required, minLength, minValue, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'InvoiceRetailFinancing',
  components: {
    DateComponent,
    ExportActionButton
  },
  mixins: [
    validationMixin
  ],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    invoiceType: 'Bank',
    invoiceYear: '',
    invoiceFilter: '',
    contentData: [],
    component: '',
    banks: []
  }),
  computed: {
    ...validationErrors,
    ...mapFields('masterData', {
      financingPartners: 'financingPartner'
    }),
    dateToday () {
      return new Date().toISOString()
    }
  },
  beforeCreate () {
    if (!this.$store.hasModule('masterData')) {
      this.$store.registerModule('masterData', masterData)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['financingPartner'])
  },
  async created () {
    await this.$store.dispatch('masterData/initOpts', { mds: ['financingPartner'] })
  },
  validations () {
    return {
      invoiceYear: {
        minLength: minLength(4),
        minValue: minValue(2000),
        required,
        maxLength: maxLength(4)
      },
      invoiceFilter: {
        required
      }
    }
  },
  methods: {
    async exportReport () {
      this.$v.$touch()
      this.component = this.invoiceType === 'Bank' ? 'InvoiceRetailBanksTable' : 'InvoiceRetailMonthlyTable'
      if (!this.$v.$invalid) {
        const fetch = await this.fetchData()
        if (fetch) {
          const el = document.getElementById(this.component)
          const wb = XLSX.utils.table_to_book(el)
          XLSX.writeFile(wb, `InvoicedRetail${this.invoiceType}${this.invoiceFilter}.xlsx`)
        } else {
          this.$emit('dialog', false)
          this.$store.dispatch('showAlert', {
            message: `No data available in year ${this.invoiceYear}`,
            type: 'error'
          })
        }
      }
    },
    async fetchData () {
      const model = this.invoiceType === 'Bank' ? 'bankApplication' : 'application'
      const reportType = this.invoiceType === 'Bank' ? 'invoiceRetailByBank' : 'invoiceRetailByMonthCompany'
      const resp = await crud(`export/report/${model}`).create({
        reportType,
        type: this.invoiceType,
        filter: this.invoiceFilter,
        year: this.invoiceYear
      })
      const data = await resp.json()
      if (resp.ok) {
        this.contentData = data.result
        if (this.invoiceType === 'Bank') {
          this.banks = this.mappedBanks(this.financingPartners)
        }
      }
      return resp.ok
    },
    mappedBanks (obj) {
      const newData = obj.map((info) => {
        return {
          _id: info._id,
          name: info.name
        }
      })
      return newData
    }
  }
}
</script>
