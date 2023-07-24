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
import table from '@/meta/crudModules/applications/table'
export default {
  name: 'ApplicationTable',
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
      return table
    }
  }
}
</script>
