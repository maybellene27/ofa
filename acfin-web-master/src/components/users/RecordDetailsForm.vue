<template>
  <v-col>
    <v-card
      v-if="!editable"
      class="pa-5"
    >
      <div class="pb-3">
        <b>Record Details</b>
      </div>
      <v-row
        align-self="start"
        justify="center"
      >
        <v-col cols="3">
          <LookUpSelect
            id="createdBy"
            v-model="createdBy"
            name="auh"
            item-text="name"
            label="Created By"
            :is-dense="true"
            :outlined="false"
            :can-edit="false"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="dateCreated"
            v-model="dateCreated"
            label="Date Created"
            dense
            :disabled="true"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="updatedBy"
            v-model="updatedBy"
            label="Updated By"
            dense
            :disabled="true"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            id="status"
            v-model="status"
            label="Status"
            dense
            :disabled="true"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { LookUpSelect } from 'maroon-vue-components'

export default {
  components: {
    LookUpSelect
  },
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...mapFields('users', {
      createdBy: 'info.createdBy',
      updatedBy: 'info.updatedBy',
      dateCreated: 'info.dateCreated',
      dateUpdated: 'info.dateUpdated',
      status: 'info.status'
    })
  }
}
</script>
