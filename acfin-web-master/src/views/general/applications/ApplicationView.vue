<template>
  <v-container flex>
    <CrudForm
      :key="operation"
      v-bind="{
        collectionName: 'application',
        meta,
        vuex: {
          modules: ['application'],
          fields: {
            user,
            age,
            birthday,
            tin,
            maritalStatus,
            citizenship,
            presentAddress,
            previousAddress,
            spouse,
            applicantEmployment,
            spouseEmployment,
            vehiclePurchased,
            status,
            bank,
            returnReason,
            bankApplication,
            bankTransferRemarks,
            consentClause,
            dateSubmitted,
            recommendDate,
            cancellationLetter,
            typeOfSeparation
          }
        }
      }"
    />
  </v-container>
</template>

<script>
import application from '@/store/application'
import { CrudForm } from 'maroon-vue-components'
import form from '@/meta/crudModules/applications/form'
import { mapFields } from 'vuex-map-fields'
import masterData from '@/store/masterData'

export default {
  name: 'ApplicationView',
  components: {
    CrudForm
  },
  data: () => ({
  }),
  computed: {
    ...mapFields('application', [
      'user',
      'status',
      'age',
      'birthday',
      'tin',
      'maritalStatus',
      'citizenship',
      'presentAddress',
      'previousAddress',
      'spouse',
      'applicantEmployment',
      'spouseEmployment',
      'vehiclePurchased',
      'bank',
      'returnReason',
      'bankApplication',
      'bankTransferRemarks',
      'consentClause',
      'dateSubmitted',
      'recommendDate',
      'cancellationLetter',
      'typeOfSeparation'
    ]),
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
    if (!this.$store.hasModule('application')) {
      this.$store.registerModule('application', application)
    }
    if (!this.$store.hasModule('masterData')) {
      this.$store.registerModule('masterData', masterData)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('application/reset')
    this.$store.dispatch('masterData/reset', ['agree'])
  }
}
</script>
