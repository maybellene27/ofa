<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: dataTab,
        meta,
        vuex: {
          modules: ['company'],
          fields: {
            name,
            address,
            email,
            mobile,
            telephone,
            branches,
            logo
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import company from '@/store/company'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/admin/company/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'CompanyView',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('company', ['name', 'address', 'email', 'mobile', 'telephone', 'branches', 'logo']),
    operation () {
      return this.$route.params.operation
    },
    dataTab () {
      return this.$route.params.userType
    },
    meta () {
      return form
    }
  },
  beforeCreate () {
    if (!this.$store.hasModule('company')) {
      this.$store.registerModule('company', company)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('company/reset')
  }
}
</script>
