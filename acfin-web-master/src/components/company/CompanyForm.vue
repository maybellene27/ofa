<template>
  <v-col>
    <v-card class="ma-5">
      <v-system-bar
        color="light-blue darken-4"
        lights-out
        dark
        height="50"
        class="pa-5"
      >
        <h3> Add Branch </h3>
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
              label="Name of Company"
              class="required-field"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('name','Name of Company')"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="address"
              v-model="address"
              class="required-field"
              label="Address"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('address', 'Address')"
              @input="$v.address.$touch()"
              @blur="$v.address.$touch()"
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
              class="required-field"
              dense
              :outlined="editable"
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
            <v-text-field
              id="mobile"
              v-model="mobile"
              label="Mobile"
              class="required-field"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('mobile', 'Mobile')"
              @input="$v.mobile.$touch()"
              @blur="$v.mobile.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="telephone"
              v-model="telephone"
              label="Telephone"
              dense
              :outlined="editable"
              :disabled="!editable"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-file-input
              v-model="logo"
              :outlined="editable"
              :disabled="!editable"
              class="required-field"
              label="Logo"
              accept="image/*"
              :error-messages="genericError('logo', 'logo')"
              :append-icon="operation === 'create' || !logo.length ? '' : 'mdi-download'"
              @input="$v.logo.$touch()"
              @blur="$v.logo.$touch()"
              @click:append="download(`attachment/company/${$route.params.id}`, logo)"
            >
              <template v-slot:selection="{ index, text, file }">
                <v-chip
                  close
                  @click:close="deleteChip(index)"
                >
                  {{ text || file.originalname }}
                </v-chip>
              </template>
            </v-file-input>
          </v-col>
        </v-row>
        <BranchForm
          ref="branchForm"
          :editable="editable"
          :operation="operation"
        />
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import fileInputMixin from '@/mixins/fileInputMixin'
import { mapFields } from 'vuex-map-fields'
import BranchForm from './BranchForm'

export default {
  components: { BranchForm },
  mixins: [validationMixin, fileInputMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...validationErrors,
    ...mapFields('company', {
      name: 'name',
      address: 'address',
      email: 'email',
      mobile: 'mobile',
      telephone: 'telephone',
      logo: 'logo',
      branches: 'branches'
    })
  },
  validations () {
    return custom.company
  }
}
</script>
