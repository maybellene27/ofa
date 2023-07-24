<template>
  <v-container>
    <v-row>
      <v-col>
        This will export the specific report of Directory of partner banks.
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        {{ directoryType === 'Branch' ? 'Please select a branch:' : 'Please select a brand:' }}
      </v-col>
    </v-row>
    <v-row
      justify="center"
    >
      <v-col
        class="d-flex justify-center"
      >
        <v-radio-group
          id="selectBranch"
          v-model="directoryType"
          row
          mandatory
          @change="() => {
            directoryParams = ''
          }"
        >
          <template v-slot:label>
            <div><strong>Type: </strong></div>
          </template>
          <v-radio
            v-for="item in ['Branch', 'Brand']"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="directoryParams"
          v-model="directoryParams"
          class="required-field"
          label="Filter"
          :items="directoryType === 'Branch' ? branch : brands"
          item-text="name"
          item-value="_id"
          :outlined="true"
          :error-messages="genericError('directoryParams', 'Filter')"
          @input="$v.directoryParams.$touch()"
          @blur="$v.directoryParams.$touch()"
        />
      </v-col>
    </v-row>
    <div style="display: none;">
      <DirectoryPartnerBanksTable
        id="directoryBanks"
        :data="contentData"
        :user="$s.user"
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
import { validationMixin, validationErrors } from '@/utils/validations'
import { required } from 'vuelidate/lib/validators'
import { mapFields } from 'vuex-map-fields'
import masterData from '@/store/masterData'
import ExportActionButton from '@/components/exports/exportDialogComponents/ExportActionButton'
import DirectoryPartnerBanksTable from '../exportTables/DirectoryPartnerBanksTable'
import XLSX from 'xlsx'
import crud from '@/rest/crud'

export default {
  name: 'DirectoryPartnerBanks',
  components: {
    ExportActionButton,
    DirectoryPartnerBanksTable
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
    directoryType: 'Branch',
    directoryParams: '',
    contentData: []
  }),
  computed: {
    ...validationErrors,
    ...mapFields('masterData', [
      'branch'
    ]),
    brands () {
      return [
        'Honda',
        'Isuzu',
        'KIA',
        'KTM',
        'Maxus',
        'Volkswagen'
      ]
    }
  },
  async beforeCreate () {
    if (!this.$store.hasModule('masterData')) {
      this.$store.registerModule('masterData', masterData)
    }
    await this.$store.dispatch('masterData/initOpts', { mds: ['branch'], dataview: { branch: 'directoryPartnerBanks' } })
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['branch'])
  },
  async created () {
  },
  methods: {
    async exportReport () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        await this.fetchData()
        const el = document.getElementById('directoryPartnerBank')
        const wb = XLSX.utils.table_to_book(el)
        XLSX.writeFile(wb, `DirectoryPartnerBankBy${this.directoryType}.xlsx`)
      }
    },
    async fetchData () {
      const resp = await crud('export/report/financingPartner').create({
        reportType: 'financingPartner',
        type: this.directoryType,
        branch: this.directoryType === 'Branch' ? this.directoryParams : undefined,
        brand: this.directoryType === 'Brand' ? this.directoryParams : undefined
      })
      const data = await resp.json()
      this.contentData = data.result && data.result[0]
    }
  },
  validations: {
    directoryParams: {
      required
    }
  }
}
</script>
