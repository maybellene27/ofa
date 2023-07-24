<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card
            class="pa-5"
            :loading="crudFormMethods.loading"
          >
            <v-row>
              <v-col class="d-flex">
                <div>
                  <b>Decline Application?</b>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                This will decline the motor vehicle application form.
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                Kindly, specify the reason below:
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="declineReason"
                  label="Reason"
                  :outlined="true"
                  :disabled="false"
                  :loading="crudFormMethods.loading"
                />
              </v-col>
            </v-row>
            <v-row
              justify="center"
            >
              <v-col
                class="d-flex justify-end"
              >
                <v-btn
                  class="px-10"
                  :loading="crudFormMethods.loading"
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  class="px-10 white--text"
                  color="grey"
                  :loading="crudFormMethods.loading"
                  @click="action(declineReason)"
                >
                  Decline
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'DeclineDialog',
  mixins: [],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    },
    action: {
      type: Function,
      default: () => {}
    }
  },
  data: () => ({
    declineReason: ''
  }),
  computed: {
    ...mapFields('application', {
      previousBranch: 'vehiclePurchased.branch'
    }),
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
