<template>
  <div>
    <div class="d-flex flex-column">
      <b>Branches</b>
      <div
        v-if="editable"
        class="my-4"
      >
        <v-btn
          id="addBranchBtn"
          text
          color="green"
          @click="addField"
        >
          + Add Branch
        </v-btn>
      </div>
    </div>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item, idx) in branches"
        :key="idx"
      >
        <v-expansion-panel-header>
          <div class="d-flex align-center">
            <div class="mr-5">
              Branch #{{ idx + 1 }}
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
                <v-text-field
                  :id="`name-${idx + 1}`"
                  v-model="item.name"
                  label="Name of Branch"
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('branches', idx, 'name', 'Name of Branch')"
                  @input="$v.branches.$each[idx].name.$touch()"
                  @blur="$v.branches.$each[idx].name.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-text-field
                  :id="`address-${idx + 1}`"
                  v-model="item.address"
                  label="Address"
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('branches', idx, 'address', 'Address')"
                  @input="$v.branches.$each[idx].address.$touch()"
                  @blur="$v.branches.$each[idx].address.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-text-field
                  :id="`email-${idx + 1}`"
                  v-model="item.email"
                  label="Email"
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('branches', idx, 'email', 'Email')"
                  @input="$v.branches.$each[idx].email.$touch()"
                  @blur="$v.branches.$each[idx].email.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-text-field
                  :id="`mobile-${idx + 1}`"
                  v-model="item.mobile"
                  label="Mobile"
                  :disabled="!editable"
                  :outlined="editable"
                  :error-messages="genericErrorObjectArray('branches', idx, 'mobile', 'Mobile')"
                  @input="$v.branches.$each[idx].mobile.$touch()"
                  @blur="$v.branches.$each[idx].mobile.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
            >
              <v-col cols="12">
                <v-text-field
                  :id="`telephone-${idx + 1}`"
                  v-model="item.telephone"
                  label="Telephone"
                  :disabled="!editable"
                  :outlined="editable"
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

export default {
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...validationErrors,
    ...mapFields('company', {
      branches: 'branches'
    })
  },
  methods: {
    addField () {
      this.branches.push(
        {
          _id: undefined,
          name: '',
          address: '',
          email: '',
          mobile: '',
          telephone: ''
        }
      )
    },
    remove (idx) {
      this.branches.splice(idx, 1)
    }
  },
  validations () {
    return {
      branches: custom.branch
    }
  }
}
</script>
