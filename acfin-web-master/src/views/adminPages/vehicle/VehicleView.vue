<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: dataTab,
        meta,
        vuex: {
          modules: ['vehicle'],
          fields: {
            brand,
            model,
            variant,
            year,
            price,
            freights
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import vehicle from '@/store/vehicle'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/admin/vehicle/form'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'VehicleView',
  components: {
    CrudForm
  },
  computed: {
    ...mapFields('vehicle', ['brand', 'model', 'variant', 'year', 'price', 'freights']),
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
    if (!this.$store.hasModule('vehicle')) {
      this.$store.registerModule('vehicle', vehicle)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('vehicle/reset')
  }
}
</script>
