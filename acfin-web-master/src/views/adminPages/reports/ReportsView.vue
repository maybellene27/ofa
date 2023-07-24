<template>
  <v-container flex>
    <v-card
      class="pa-12"
    >
      <v-row>
        <v-col>
          <h1 class="primaryTxt mb-10">
            Reports
          </h1>
          <v-select
            v-model="reportType"
            class="mb-10"
            :items="$s.userRole && $s.userRole.includes('salesManager') ? salesManagerItems : items"
            label="Click me to select a report"
            outlined
          />
          <v-btn
            v-if="reportType"
            tile
            class="white--text"
            color="blue darken-4"
            elevation="2"
            @click="dialog = true"
          >
            <v-icon left>
              mdi-pencil
            </v-icon>
            Export Report
          </v-btn>
        </v-col>
        <v-col
          class="d-flex justify-center"
        >
          <v-img
            :src="$metaData.app.reportsLogo"
            width="400px"
            min-width="100px"
            contain
          />
        </v-col>
      </v-row>
    </v-card>
    <export-dialog
      v-model="dialog"
      :title="reportType"
    />
  </v-container>
</template>

<script>
import ExportDialog from '@/components/exports/ExportDialog'

export default {
  name: 'ReportsView',
  components: {
    ExportDialog
  },
  data: () => ({
    reportType: '',
    dialog: false,
    items: [
      'Directory of Partner Banks',
      'Invoiced Retail',
      'YTD Dashboard of Partner Banks Performance',
      'Conso Retail Financing per Bank'
    ],
    salesManagerItems: [
      'Directory of Partner Banks'
    ]
  })
}
</script>

<style scoped>
.primarybg {
  background-color: #247CE3;
}
.primaryTxt {
  color: #247CE3;
}
</style>
