<template>
  <v-container>
    <v-row>
      <v-col
        class="d-flex justify-end"
      >
        <v-btn
          id="cancelBtn"
          color="grey"
          text
          class="px-10"
          @click="$emit('dialog', false)"
        >
          Cancel
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
          id="exportBtn"
          color="blue darken-4"
          class="white--text px-10"
          tile
          @click="$emit('action')"
        >
          {{ buttonLabel }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'ExportActionButton',
  props: {
    buttonLabel: {
      type: String,
      default: 'Export'
    }
  }
}
</script>
