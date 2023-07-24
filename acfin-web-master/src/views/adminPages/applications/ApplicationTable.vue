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
import table from '@/meta/crudModules/admin/application/table'

export default {
  name: 'ApplicationTable',
  components: {
    CrudTable
  },
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
