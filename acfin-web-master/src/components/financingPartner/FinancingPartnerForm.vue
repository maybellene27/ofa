<template>
  <v-col>
    <v-card>
      <v-system-bar
        color="light-blue darken-4"
        lights-out
        dark
        height="50"
        class="pa-5"
      >
        <h3> Add Financing Partner </h3>
      </v-system-bar>
      <div
        class="pa-5"
      >
        <div class="pb-3">
          <b>Enter Details</b>
        </div>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="name"
              v-model="name"
              label="Name of Bank*"
              dense
              filled
              :disabled="!editable"
              :error-messages="genericError('name','Name of Bank')"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-autocomplete
              id="branch"
              v-model="branch"
              :items="branches"
              item-value="_id"
              item-text="name"
              label="AC Motors Brand/Branch(es) handled*"
              deletable-chips
              multiple
              dense
              filled
              small-chips
              :disabled="!editable"
              :error-messages="genericError('branch','Branch')"
              @input="$v.branch.$touch()"
              @blur="$v.branch.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-autocomplete
              id="brand"
              v-model="brand"
              :items="brands"
              label="Brand"
              deletable-chips
              multiple
              dense
              filled
              small-chips
              :disabled="!editable"
              :error-messages="genericError('brand','Brand')"
              @input="$v.brand.$touch()"
              @blur="$v.brand.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="contactPerson"
              v-model="contactPerson"
              label="Name of Contact Person*"
              dense
              filled
              :disabled="!editable"
              :error-messages="genericError('contactPerson','Name of Bank')"
              @input="$v.contactPerson.$touch()"
              @blur="$v.contactPerson.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-autocomplete
              id="designation"
              v-model="designation"
              :items="designations"
              label="Designation*"
              dense
              filled
              :disabled="!editable"
              :error-messages="genericError('designation','Designation')"
              @input="$v.designation.$touch()"
              @blur="$v.designation.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-autocomplete
              id="department"
              v-model="department"
              :items="departments"
              label="Department*"
              dense
              filled
              :disabled="!editable"
              :error-messages="genericError('department','Department')"
              @input="$v.department.$touch()"
              @blur="$v.department.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="email"
              v-model="email"
              label="Email"
              type="email"
              dense
              filled
              :disabled="!editable"
              :error-messages="genericError('email', 'Email')"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-combobox
              id="mobileNo"
              v-model="mobileNo"
              type="number"
              label="Mobile Number"
              dense
              filled
              multiple
              small-chips
              deletable-chips
              :disabled="!editable"
              :error-messages="genericError('mobileNo','Mobile Number')"
              @input="$v.mobileNo.$touch()"
              @blur="$v.mobileNo.$touch()"
            />
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'

export default {
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  data: () => ({
    brands: [
      'Honda',
      'Isuzu',
      'KIA',
      'KTM',
      'Maxus',
      'Volkswagen'
    ]
  }),
  computed: {
    ...validationErrors,
    ...mapFields('financingPartner', {
      name: 'name',
      branch: 'branch',
      brand: 'brand',
      contactPerson: 'contactPerson',
      designation: 'designation',
      department: 'department',
      email: 'email',
      mobileNo: 'mobileNo'
    }),
    ...mapFields('masterData', {
      branches: 'branch',
      branchIsLoading: 'branchIsLoading'
    }),
    designations () {
      return ['Software Engineer', 'Manager', 'Assistant Manager']
    },
    departments () {
      return ['IT', 'Finance', 'Sales', 'Marketing']
    }
  },
  created () {
    this.$store.dispatch('masterData/initOpts', { mds: ['branch'] })
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['branch'])
  },
  validations () {
    return custom.financingPartner
  }
}
</script>
