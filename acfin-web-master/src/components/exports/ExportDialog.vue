<template>
  <v-container>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        :width="title === 'Conso Retail Financing per Bank' ? '800px' : 600"
      >
        <v-card
          style="overflow-x: hidden"
        >
          <div
            class="d-flex justify-end"
          >
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </div>
          <v-card-title
            class="d-flex justify-center mb-4"
          >
            <div
              class="blue--text text-h6"
            >
              <b>{{ title }}</b>
            </div>
          </v-card-title>
          <v-card-text>
            <DirectoryPartnerBanks
              v-if="title === 'Directory of Partner Banks'"
              :title="title"
              @dialog="(obj) => {
                dialog = obj
              }"
            />
            <InvoiceRetailFinancing
              v-if="title === 'Invoiced Retail'"
              :title="title"
              @dialog="(obj) => {
                dialog = obj
              }"
            />
            <YTDDashboard
              v-if="title === 'YTD Dashboard of Partner Banks Performance'"
              :title="title"
              @dialog="(obj) => {
                dialog = obj
              }"
            />
            <ConsoRetailFinancing
              v-if="title === 'Conso Retail Financing per Bank'"
              :title="title"
              @dialog="(obj) => {
                dialog = obj
              }"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
import DirectoryPartnerBanks from '@/components/exports/exportDialogComponents/DirectoryPartnerBanks'
import InvoiceRetailFinancing from '@/components/exports/exportDialogComponents/InvoiceRetailFinancing'
import YTDDashboard from '@/components/exports/exportDialogComponents/YTDDashboard'
import ConsoRetailFinancing from '@/components/exports/exportDialogComponents/ConsoRetailFinancing'

export default {
  name: 'ReportsDialog',
  components: {
    DirectoryPartnerBanks,
    InvoiceRetailFinancing,
    YTDDashboard,
    ConsoRetailFinancing
  },
  mixins: [],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  }
}
</script>
