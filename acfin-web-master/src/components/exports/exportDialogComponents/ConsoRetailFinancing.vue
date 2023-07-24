<template>
  <v-container>
    <v-row>
      <v-col>
        This will export the specific report of Conso Retail Financing per Bank.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Please provide the year to proceed:
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-col>
        <DateComponent
          id="consoYear"
          v-model="consoYear"
          :no-title="true"
          date-class="required-field"
          placeholder="YYYY"
          label="Year"
          :max="dateToday"
          :value="consoYear"
          :error-messages="genericError('consoYear','Year')"
          @input="$v.consoYear.$touch()"
          @blur="$v.consoYear.$touch()"
        />
      </v-col>
    </v-row>
    <ExportActionButton
      button-label="Generate Chart"
      @action="exportReport()"
      @dialog="(obj) => {
        $emit('dialog', obj)
      }"
    />
    <v-row
      v-if="component"
      class="mt-5"
    >
      <v-col
        class="d-flex justify-end"
      >
        <v-btn
          color="red lighten-1 white--text"
          dense
          @click="generatePDF()"
        >
          <v-icon>
            mdi-file-export-outline
          </v-icon>
          Export to PDF
        </v-btn>
      </v-col>
    </v-row>
    <div
      style="width: 750px"
    >
      <component
        :is="component"
        :id="component"
        :key="key"
        :data="contentData"
      />
    </div>
  </v-container>
</template>
<script>
import DateComponent from '@/components/fields/DateComponent'
import ExportActionButton from '@/components/exports/exportDialogComponents/ExportActionButton'
import exportPDFMixin from '../../../mixins/exportPDFMixin'
import ChartGraph from '../exportCharts/ChartGraph'
import crud from '@/rest/crud'
import { validationMixin, validationErrors } from '@/utils/validations'
import { required, minLength, minValue, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'ConsoRetailFinancing',
  components: {
    DateComponent,
    ExportActionButton,
    ChartGraph
  },
  mixins: [
    exportPDFMixin,
    validationMixin
  ],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    consoYear: '',
    contentData: {},
    component: '',
    key: 0
  }),
  computed: {
    ...validationErrors,
    dateToday () {
      return new Date().toISOString()
    }
  },
  validations () {
    return {
      consoYear: {
        minLength: minLength(4),
        minValue: minValue(2000),
        required,
        maxLength: maxLength(4)
      }
    }
  },
  beforeDestroy () {
    this.key = 0
  },
  methods: {
    async exportReport () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.fetchData()
        this.key += 1
        if (this.contentData && this.contentData.count !== 0) {
          this.component = 'ChartGraph'
          await this.fetchData()
        } else {
          this.$emit('dialog', false)
          this.$store.dispatch('showAlert', {
            message: `No data available in year ${this.consoYear}`,
            type: 'error'
          })
        }
      }
    },
    setPDFTemplate () {
      this.element = document.getElementById('ChartGraph')
      return this.element
    },
    async fetchData () {
      const resp = await crud('export/report/bankApplication').create({
        reportType: 'conso',
        year: this.consoYear
      })
      const data = await resp.json()
      this.contentData = data.result
    },
    async generatePDF () {
      window.scroll(0, 0)
      this.element = null
      const element = this.setPDFTemplate()
      if (element === null) {
        setTimeout(async () => {
          await this.generatePDF()
        }, 500)
      } else {
        this.savePDF(element, 'piegraph')
      }
    }
  }
}
</script>
