<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: dataTab,
        meta,
        vuex: {
          modules: ['users', 'application'],
          fields: {
            ...info,
            application
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import users from '@/store/users'
import application from '@/store/application'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/admin/application/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ApplicationView',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('users', ['info']),
    ...mapFields('application', ['application']),
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
    if (!this.$store.hasModule('users')) {
      this.$store.registerModule('users', users)
    }
    if (!this.$store.hasModule('application')) {
      this.$store.registerModule('application', application)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('users/reset')
    this.$store.dispatch('application/reset')
  }
}
</script>
