<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: dataTab,
        meta,
        vuex: {
          modules: ['users', 'profile'],
          fields: info
        }
      }"
    />
  </v-container>
</template>

<script>
import users from '@/store/users'
import profile from '@/store/profile'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/general/profile/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'ProfileView',
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
  beforeCreate () {
    if (!this.$store.hasModule('users')) {
      this.$store.registerModule('users', users)
    }
    if (!this.$store.hasModule('profile')) {
      this.$store.registerModule('profile', profile)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('users/reset')
  }
}
</script>
