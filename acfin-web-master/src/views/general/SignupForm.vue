<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: 'users',
        meta,
        vuex: {
          modules: ['users'],
          fields: info
        }
      }"
    />
  </v-container>
</template>

<script>
import users from '@/store/users'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/general/signup/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'UserSignup',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('users', ['info']),
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
  created () {
    this.info.userRole = 'customer'
    this.info.userType = 'External'
  },
  beforeCreate () {
    if (!this.$store.hasModule('users')) {
      this.$store.registerModule('users', users)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('users/reset')
  }
}
</script>
