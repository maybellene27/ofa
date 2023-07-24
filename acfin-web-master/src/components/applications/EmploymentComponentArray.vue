<template>
  <v-container>
    <v-row
      v-show="false"
    >
      <v-col
        class="d-flex justify-end"
      >
        <v-btn
          color="primary"
          text
          :disabled="!editable"
          @click="addComaker()"
        >
          <v-icon>
            mdi-account-plus-outline
          </v-icon>
          <span class="ml-2">Add Co-Maker</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      v-for="(content, index) in employment"
      :key="index"
    >
      <v-col>
        <v-card>
          <div
            v-if="false"
            class="d-flex justify-end"
          >
            <v-btn
              text
              color="error"
              :disabled="!editable"
              @click="removeComaker(index)"
            >
              <v-icon>
                mdi-close
              </v-icon>
              <span>Remove</span>
            </v-btn>
          </div>
          <v-card-text>
            <v-row>
              <v-col>
                <v-radio-group
                  :id="`${type}EmploymentType${index}`"
                  v-model="content.type"
                  mandatory
                  row
                  :disabled="!editable"
                >
                  <template v-slot:label>
                    <div>
                      <strong>{{ title }} {{ index+1 }}: </strong>
                    </div>
                  </template>
                  <v-radio
                    v-for="item in applicantTypeOption"
                    :id="`${type}EmploymentTypeItems${index}`"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  :id="`${type}EmploymentName${index}`"
                  v-model="content.name"
                  :class="fieldClass"
                  label="Employer / Business Name"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'name', 'Emp/Bus Name')"
                  @input="$v.employment.$each[index].name.$touch()"
                  @blur="$v.employment.$each[index].name.$touch()"
                />
              </v-col>
            </v-row>
            <div class="pb-3">
              <b>Address</b>
            </div>
            <v-row>
              <v-col>
                <v-text-field
                  :id="`${type}EmploymentAddress${index}`"
                  v-model="content.address"
                  :class="fieldClass"
                  label="Employment / Business Address"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'address', 'Address')"
                  @input="$v.employment.$each[index].address.$touch()"
                  @blur="$v.employment.$each[index].address.$touch()"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  :id="`${type}EmploymentPosition${index}`"
                  v-model="content.position"
                  :class="fieldClass"
                  label="Position"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'position', 'Position')"
                  @input="$v.employment.$each[index].position.$touch()"
                  @blur="$v.employment.$each[index].position.$touch()"
                />
              </v-col>
              <v-col>
                <v-text-field
                  :id="`${type}EmploymentTelephone${index}`"
                  v-model="content.telephone"
                  label="Telephone No."
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'telephone', 'Telephone No.')"
                  @input="$v.employment.$each[index].telephone.$touch()"
                  @blur="$v.employment.$each[index].telephone.$touch()"
                />
              </v-col>
              <v-col>
                <v-text-field
                  :id="`${type}EmploymentYears${index}`"
                  v-model="content.years"
                  :class="fieldClass"
                  label="Yrs."
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'years', 'Yrs.')"
                  @input="$v.employment.$each[index].years.$touch()"
                  @blur="$v.employment.$each[index].years.$touch()"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="4"
                md="4"
              >
                <v-text-field
                  :id="`${type}EmploymentMonthlyIncome${index}`"
                  v-model="content.monthlyIncome"
                  :class="fieldClass"
                  prepend-inner-icon="₱"
                  label="Monthly Income"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'monthlyIncome', 'Monthly Income')"
                  @input="(obj) => {
                    $v.employment.$each[index].monthlyIncome.$touch()
                    getMonthlyIncome(obj, index)
                  }"
                  @blur="$v.employment.$each[index].monthlyIncome.$touch()"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
                md="4"
              >
                <v-text-field
                  :id="`${type}EmploymentOtherSourceOfIncome${index}`"
                  v-model="content.otherSourceOfIncome"
                  label="Other Source of Income"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('employment', index, 'otherSourceOfIncome', 'Other Source of Income')"
                  @input="$v.employment.$each[index].otherSourceOfIncome.$touch()"
                  @blur="$v.employment.$each[index].otherSourceOfIncome.$touch()"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { convertToCurrency } from '@/utils/helpers'

export default {
  name: 'EmploymentComponent',
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean,
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    fieldRequired: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    applicantTypeOption: [
      'Employment',
      'Business'
    ]
  }),
  computed: {
    ...validationErrors,
    fieldClass () {
      let classReq
      if (this.fieldRequired) {
        classReq = 'required-field'
      }
      return classReq
    },
    employment: {
      get () {
        return this.$store.getters['application/getCustomObject'](this.type)
      },
      set (value) {
        this.$store.dispatch('application/setCustomObject', value, this.type)
      }
    }
  },
  watch: {
    'employment.monthlyIncome': {
      handler (obj) {
        this.getMonthlyIncome(obj, 'monthlyIncome')
      }
    }
  },
  methods: {
    getMonthlyIncome (obj, index) {
      this.employment[index].monthlyIncome = convertToCurrency(obj)
    },
    addComaker () {
      this.employment.push({
        type: undefined,
        name: undefined,
        address: undefined,
        position: undefined,
        telephone: undefined,
        years: undefined,
        monthlyIncome: undefined,
        otherSourceOfIncome: undefined
      })
    },
    removeComaker (index) {
      if (this.employment && this.employment.length) {
        this.employment.splice(index, 1)
      }
    }
  },
  validations () {
    return {
      employment: {
        ...custom.employmentArray(this)
      }
    }
  }
}
</script>
