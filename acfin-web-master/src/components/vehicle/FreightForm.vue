<template>
  <div>
    <div class="d-flex flex-column">
      <b>Freights</b>
      <div
        v-if="editable"
        class="my-4"
      >
        <v-btn
          id="addFreightBtn"
          text
          color="green"
          @click="addField"
        >
          + Add Branch and Freight Cost
        </v-btn>
      </div>
    </div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item, idx) in freights"
        :key="idx"
      >
        <v-expansion-panel-header>
          <div class="d-flex align-center">
            <div class="mr-5">
              Freight #{{ idx + 1 }}
            </div>
            <v-btn
              v-if="editable"
              :id="`deleteBtn-${idx + 1}`"
              text
              color="red"
              icon
              x-small
              @click="remove(idx)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            style="margin-top: 20px; border: 0.5px solid #a9a7a7;"
            class="pa-5"
            flat
          >
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-autocomplete
                  :id="`branch-${idx + 1}`"
                  v-model="item.branch"
                  label="Branch"
                  :items="branches"
                  :loading="branchIsLoading"
                  item-value="_id"
                  item-text="name"
                  multiple
                  deletable-chips
                  small-chips
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('freights', idx, 'branch', 'Branch')"
                  @input="$v.freights.$each[idx].branch.$touch()"
                  @blur="$v.freights.$each[idx].branch.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-text-field
                  :id="`freightCost-${idx + 1}`"
                  v-model="item.freightCost"
                  type="text"
                  label="Freight Cost"
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('freights', idx, 'freightCost', 'Freight Cost')"
                  @input="() => {
                    getCost(idx)
                    $v.freights.$each[idx].freightCost.$touch()
                  }"
                  @blur="$v.freights.$each[idx].freightCost.$touch()"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { validationMixin, validationErrors, custom } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'
import { convertToCurrency } from '@/utils/helpers'

export default {
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...validationErrors,
    ...mapFields('vehicle', {
      freights: 'freights'
    }),
    ...mapFields('masterData', {
      branches: 'branch',
      branchIsLoading: 'branchIsLoading'
    })
  },
  created () {
    this.$store.dispatch('masterData/initOpts', { mds: ['branch'] })
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['branch'])
  },
  methods: {
    getCost (key) {
      this.freights[key].freightCost = convertToCurrency(this.freights[key].freightCost)
    },
    changeToCurrency (val, key) {
      key = convertToCurrency(val)
    },
    addField () {
      this.freights.push(
        {
          _id: undefined,
          branch: '',
          freightCost: ''
        }
      )
    },
    remove (idx) {
      this.$store.dispatch('showDialog', {
        title: 'Remove branch and freight cost?',
        message: 'All data will be lost and cannot be undone.',
        buttonLabel: 'Delete',
        callback: () => {
          this.freights.splice(idx, 1)
        }
      })
    }
  },
  validations () {
    return {
      freights: custom.freight
    }
  }
}
</script>
