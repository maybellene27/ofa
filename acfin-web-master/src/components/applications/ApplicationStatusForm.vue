<template>
  <v-col>
    <v-card
      v-if="operation !== 'create'"
      class="pa-5"
    >
      <v-row>
        <v-col cols="3">
          <v-text-field
            v-model="status"
            label="Application Status"
            type="text"
            readonly
            :class="`${status} status highlight-label`"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...mapFields('application', {
      status: 'application.status'
    })
  }
}
</script>

<style scoped>
.highlight-label >>> label {
  font-weight: bold;
  font-size: 18px !important;
}
</style>
