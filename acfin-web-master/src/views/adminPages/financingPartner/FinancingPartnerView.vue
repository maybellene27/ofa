<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: dataTab,
        meta,
        vuex: {
          modules: ['financingPartner'],
          fields: {
            name,
            branch,
            contactPerson,
            designation,
            department,
            email,
            mobileNo,
            brand
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import financingPartner from '@/store/financingPartner'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/admin/financingPartner/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'FinancingPartnerView',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('financingPartner', ['name', 'branch', 'contactPerson', 'designation', 'department', 'email', 'mobileNo', 'brand']),
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
    if (!this.$store.hasModule('financingPartner')) {
      this.$store.registerModule('financingPartner', financingPartner)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('financingPartner/reset')
  }
}
</script>
