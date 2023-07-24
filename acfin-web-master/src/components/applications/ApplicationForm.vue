<template>
  <v-col>
    <v-card class="pa-5">
      <div class="pb-3">
        <b>Application Details</b>
      </div>
      <v-row
        align-self="start"
      >
        <v-col cols="3">
          <v-text-field
            v-model="genericField1"
            label="Generic Field 1"
            dense
            :outlined="editable"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="genericField2"
            label="Generic Field 2"
            dense
            :outlined="editable"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="genericField3"
            label="Generic Field 3"
            dense
            :outlined="editable"
            :disabled="!editable"
          />
        </v-col>
      </v-row>
      <v-row
        align-self="start"
      >
        <v-col cols="3">
          <v-text-field
            v-model="genericField4"
            label="Generic Field 4"
            dense
            :outlined="editable"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="genericField5"
            label="Generic Field 5"
            dense
            :outlined="editable"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="genericField6"
            label="Generic Field 6"
            dense
            :outlined="editable"
            :disabled="!editable"
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
      genericField1: 'application.genericField1',
      genericField2: 'application.genericField2',
      genericField3: 'application.genericField3',
      genericField4: 'application.genericField4',
      genericField5: 'application.genericField5',
      genericField6: 'application.genericField6'
    })
  }
}
</script>
