<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <v-radio-group
              :id="`${type}EmploymentType`"
              v-model="employment.type"
              mandatory
              row
              :disabled="!editable"
            >
              <template v-slot:label>
                <div>
                  <strong>{{ title }}: </strong>
                </div>
              </template>
              <v-radio
                v-for="item in applicantTypeOption"
                :id="`${type}EmploymentTypeItems`"
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
              :id="`${type}EmploymentName`"
              v-model="employment.name"
              :class="fieldClass"
              label="Employer / Business Name"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.name','Emp/Bus Name')"
              @input="$v.employment.name.$touch()"
              @blur="$v.employment.name.$touch()"
            />
          </v-col>
        </v-row>
        <div class="pb-3">
          <b>Address</b>
        </div>
        <v-row>
          <v-col>
            <v-text-field
              :id="`${type}EmploymentAddress`"
              v-model="employment.address"
              :class="fieldClass"
              label="Employment / Business Address"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.address','Address')"
              @input="$v.employment.address.$touch()"
              @blur="$v.employment.address.$touch()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              :id="`${type}EmploymentPosition`"
              v-model="employment.position"
              :class="fieldClass"
              label="Position"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.position','Position')"
              @input="$v.employment.position.$touch()"
              @blur="$v.employment.position.$touch()"
            />
          </v-col>
          <v-col>
            <v-text-field
              :id="`${type}EmploymentTelephone`"
              v-model="employment.telephone"
              label="Telephone No."
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.telephone','Telephone No.')"
              @input="$v.employment.telephone.$touch()"
              @blur="$v.employment.telephone.$touch()"
            />
          </v-col>
          <v-col>
            <v-text-field
              :id="`${type}EmploymentYears`"
              v-model="employment.years"
              :class="fieldClass"
              label="Yrs."
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.years','Yrs.')"
              @input="$v.employment.years.$touch()"
              @blur="$v.employment.years.$touch()"
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
              :id="`${type}EmploymentMonthlyIncome`"
              v-model="employment.monthlyIncome"
              :class="fieldClass"
              prepend-inner-icon="₱"
              label="Monthly Income"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.monthlyIncome','Monthly Income')"
              @input="$v.employment.monthlyIncome.$touch()"
              @blur="$v.employment.monthlyIncome.$touch()"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="4"
          >
            <v-text-field
              :id="`${type}EmploymentOtherSourceOfIncome`"
              v-model="employment.otherSourceOfIncome"
              label="Other Source of Income"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('employment.otherSourceOfIncome','Other Source of Income')"
              @input="$v.employment.otherSourceOfIncome.$touch()"
              @blur="$v.employment.otherSourceOfIncome.$touch()"
            />
          </v-col>
        </v-row>
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
    getMonthlyIncome (obj, key) {
      this.employment[key] = convertToCurrency(obj)
    }
  },
  validations () {
    return {
      employment: {
        ...custom.employment(this)
      }
    }
  }
}
</script>
