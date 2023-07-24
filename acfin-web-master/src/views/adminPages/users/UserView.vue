<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: 'user',
        meta,
        vuex: {
          modules: ['users'],
          fields: {
            ...info,
            attachments
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import users from '@/store/users'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/admin/user/form'
import { mapFields } from 'vuex-map-fields'
import profile from '@/store/profile'

export default {
  name: 'UserForm',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('users', ['info']),
    ...mapFields('users', {
      attachments: 'attachments'
    }),
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
  },
  async created () {
    await this.getProfile()
  },
  methods: {
    async getProfile () {
      await this.$store.dispatch('profile/get')
    }
  }
}
</script>
