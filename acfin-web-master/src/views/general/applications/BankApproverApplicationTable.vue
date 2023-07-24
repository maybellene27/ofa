<template>
  <v-container flex>
    <CrudTable
      v-bind="{
        meta
      }"
    />
  </v-container>
</template>

<script>
import { CrudTable } from 'maroon-vue-components'
import bankApplicationTable from '@/meta/crudModules/applications/bankApplicationTable'
export default {
  name: 'BankApplicationTable',
  components: {
    CrudTable
  },
  data: () => ({
    currentUser: {}
  }),
  computed: {
    dataTab () {
      return this.$route.params.userType
    },
    meta () {
      return bankApplicationTable
    }
  }
}
</script>
