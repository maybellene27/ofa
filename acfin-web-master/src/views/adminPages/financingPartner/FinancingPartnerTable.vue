<template>
  <v-container flex>
    <CrudTable
      v-bind="{
        meta,
        vuex: {
          financingPartners
        }
      }"
    />
  </v-container>
</template>

<script>
import { CrudTable } from 'maroon-vue-components'
import table from '@/meta/crudModules/admin/financingPartner/table'
import crud from '@/rest/crud'

export default {
  name: 'FinancingPartnerTable',
  components: {
    CrudTable
  },
  data: () => ({
    financingPartners: []
  }),
  computed: {
    dataTab () {
      return this.$route.params.userType
    },
    meta () {
      return table
    }
  },
  async created () {
    await this.fetchFinancingPartners()
  },
  methods: {
    async fetchFinancingPartners () {
      const data = await crud('financingPartner').list()
      this.financingPartners = data.entries
    }
  }
}
</script>
