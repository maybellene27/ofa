<template>
  <v-container flex>
    <CrudTable
      v-bind="{
        meta,
        vuex: {
          companies
        }
      }"
    />
  </v-container>
</template>

<script>
import { CrudTable } from 'maroon-vue-components'
import table from '@/meta/crudModules/admin/company/table'
import crud from '@/rest/crud'

export default {
  name: 'CompanyTable',
  components: {
    CrudTable
  },
  data: () => ({
    companies: []
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
    await this.fetchCompanies()
  },
  methods: {
    async fetchCompanies () {
      const data = await crud('company').list()
      this.companies = data.entries
    }
  }
}
</script>
