<template>
  <v-container>
    <div class="pb-3">
      <b>Applicant</b>
    </div>
    <v-row
      v-if="!isExternal"
    >
      <v-col>
        <LookUpSelect
          v-if="operation === 'create'"
          id="userSelection"
          v-model="user"
          name="auh"
          item-text="name"
          label="User"
          :query="{ userRole: 'customer' }"
          text-field-class="required-field"
          :is-dense="false"
          :outlined="false"
          :can-edit="editable"
          :error-messages="genericError('user','User')"
          @input="$v.user.$touch()"
          @blur="$v.user.$touch()"
        />
        <div
          v-else-if="operation === 'view'"
          id="userFullNameView"
          class="font-weight-bold"
        >
          {{ applicantFirstName }} {{ applicantMiddleName }} {{ applicantLastName }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-text-field
          id="applicantLastName"
          v-model="applicantLastName"
          class="black--text required-field"
          label="Last Name"
          type="text"
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantLastName','Last name')"
          @input="$v.applicantLastName.$touch()"
          @blur="$v.applicantLastName.$touch()"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          id="applicantFirstName"
          v-model="applicantFirstName"
          class="black--text required-field"
          label="First Name"
          type="text"
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantFirstName','First name')"
          @input="$v.applicantFirstName.$touch()"
          @blur="$v.applicantFirstName.$touch()"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          id="applicantMiddleName"
          v-model="applicantMiddleName"
          class="black--text"
          label="Middle Name"
          type="text"
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantMiddleName','First name')"
          @input="$v.applicantMiddleName.$touch()"
          @blur="$v.applicantMiddleName.$touch()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="5">
        <v-text-field
          id="applicantEmail"
          v-model="applicantEmail"
          class="black--text required-field"
          label="Email Address"
          type="email"
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantEmail','Email')"
          @input="$v.applicantEmail.$touch()"
          @blur="$v.applicantEmail.$touch()"
        />
      </v-col>
      <v-col cols="5">
        <DateComponent
          id="applicantBirthday"
          v-model="applicantBirthday"
          :value="applicantBirthday"
          label="Birthday"
          :is-dense="false"
          placeholder="YYYY-MM-DD"
          date-class="black--text required-field"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('applicantBirthday','Birthday')"
          @input="() => {
            $v.applicantBirthday.$touch()
            handleAge()
          }"
          @blur="$v.applicantBirthday.$touch()"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          id="applicantAge"
          v-model="applicantAge"
          class="black--text required-field"
          label="Age"
          type="text"
          disabled
          :error-messages="genericError('applicantAge','Age')"
          @input="$v.applicantAge.$touch()"
          @blur="$v.applicantAge.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      align-self="start"
      justify="center"
    >
      <v-col cols="5">
        <v-text-field
          id="applicantTin"
          v-model="applicantTin"
          class="black--text required-field"
          label="TIN"
          type="text"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('applicantTin','TIN')"
          @input="$v.applicantTin.$touch()"
          @blur="$v.applicantTin.$touch()"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          id="applicantTelephone"
          v-model="applicantTelephone"
          class="black--text"
          label="Tel. No."
          type="text"
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantTelephone','TIN')"
          @input="$v.applicantTelephone.$touch()"
          @blur="$v.applicantTelephone.$touch()"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          id="applicantMobile"
          v-model="applicantMobile"
          class="black--text required-field"
          label="Mobile No."
          :outlined="false"
          :disabled="true"
          :error-messages="genericError('applicantMobile','Mobile No.')"
          @input="$v.applicantMobile.$touch()"
          @blur="$v.applicantMobile.$touch()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group
          id="applicantMaritalStatus"
          v-model="applicantMaritalStatus"
          label="Marital Status: "
          row
          mandatory
          :disabled="!editable"
          :error-messages="genericError('applicantMaritalStatus','Marital Status: ')"
          @input="$v.applicantMaritalStatus.$touch()"
          @blur="$v.applicantMaritalStatus.$touch()"
        >
          <template v-slot:label>
            <div><strong>Marital Status: </strong></div>
          </template>
          <v-radio
            v-for="item in radioButtonOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
      <v-col
        v-if="applicantMaritalStatus === 'Separated'"
        cols="3"
      >
        <v-select
          id="typeOfSeparation"
          v-model="typeOfSeparation"
          :items="separationOptions"
          class="black--text"
          label="Type of Separation"
          :outlined="editable"
          :disabled="!editable"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          id="applicantCitizenship"
          v-model="applicantCitizenship"
          class="black--text required-field"
          label="Citizenship"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('applicantCitizenship','Citizenship')"
          @input="$v.applicantCitizenship.$touch()"
          @blur="$v.applicantCitizenship.$touch()"
        />
      </v-col>
    </v-row>
    <div class="pb-3">
      <b>Present Address</b>
    </div>
    <v-row>
      <Address
        ref="presentAddressRef"
        first-layer-obj="presentAddress"
        :editable="editable"
      >
        <template v-slot:addCol>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <v-text-field
              id="presentAddressLengthOfStay"
              v-model="presentAddressLengthOfStay"
              class="black--text required-field"
              label="Length of Stay"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('presentAddressLengthOfStay','Length of Stay')"
              @input="$v.presentAddressLengthOfStay.$touch()"
              @blur="$v.presentAddressLengthOfStay.$touch()"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <v-text-field
              id="presentAddressNoOfDependents"
              v-model="presentAddressNoOfDependents"
              class="black--text required-field"
              label="No. of Dependents"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('presentAddressNoOfDependents','No. of Dependents')"
              @input="$v.presentAddressNoOfDependents.$touch()"
              @blur="$v.presentAddressNoOfDependents.$touch()"
            />
          </v-col>
        </template>
      </Address>
    </v-row>
    <v-row>
      <v-col>
        <v-radio-group
          id="presentAddressOwnership"
          v-model="presentAddressOwnership"
          class
          row
          mandatory
          :disabled="!editable"
          :error-messages="genericError('presentAddressOwnership','Ownership')"
          @input="$v.presentAddressOwnership.$touch()"
          @blur="$v.presentAddressOwnership.$touch()"
        >
          <template v-slot:label>
            <div><strong>Ownership: </strong></div>
          </template>
          <v-radio
            v-for="item in ownership"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <div class="pb-3">
      <b>Permanent Address</b>
    </div>
    <div
      class="d-flex"
    >
      <v-checkbox
        v-if="editable"
        v-model="sameAsPresent"
        @change="sameAsPresentAction"
      />
      <span
        v-if="editable"
        class="mt-5"
      >
        Same as Present Address
      </span>
    </div>
    <v-row>
      <Address
        ref="previousAddressRef"
        first-layer-obj="previousAddress"
        :editable="editable"
      >
        <template v-slot:addCol>
          <v-col
            cols="12"
            md="3"
            sm="3"
          >
            <v-text-field
              id="previousAddressLengthOfStay"
              v-model="previousAddressLengthOfStay"
              class="black--text required-field"
              label="Length of Stay"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('previousAddressLengthOfStay','Length of Stay')"
              @input="$v.previousAddressLengthOfStay.$touch()"
              @blur="$v.previousAddressLengthOfStay.$touch()"
            />
          </v-col>
        </template>
      </Address>
    </v-row>
    <div class="mb-5 pb-3 d-flex justify-space-between">
      <div>
        <b>Spouse / Co-Maker</b>
      </div>
      <div
        v-if="spouse && spouse.length < 3"
      >
        <v-btn
          color="primary"
          text
          :disabled="!editable"
          @click="addCoMaker()"
        >
          <v-icon>
            mdi-account-plus-outline
          </v-icon>
          <span class="ml-2">Add Co-Maker</span>
        </v-btn>
      </div>
    </div>
    <v-row
      v-for="(content, index) in spouse"
      :key="index"
    >
      <v-col>
        <v-card>
          <div
            v-if="spouse && spouse.length > 1"
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
              <v-col
                class="mt-0"
                cols="2"
              >
                <b>Spouse/Co-maker {{ index + 1 }}</b>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="4"
              >
                <v-text-field
                  :id="`spouseRelationship${index}`"
                  v-model="content.relationship"
                  class="black--text"
                  label="Relationship"
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-text-field
                  :id="`spouseLastName${index}`"
                  v-model="content.lastName"
                  class="black--text"
                  label="Last Name"
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'lastName', 'Last Name')"
                  @input="$v.spouse.$each[index].lastName.$touch()"
                  @blur="$v.spouse.$each[index].lastName.$touch()"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :id="`spouseFirstName${index}`"
                  v-model="content.firstName"
                  class="black--text"
                  label="First Name"
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'firstName', 'First Name')"
                  @input="$v.spouse.$each[index].firstName.$touch()"
                  @blur="$v.spouse.$each[index].firstName.$touch()"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :id="`spouseMiddleName${index}`"
                  v-model="content.middleName"
                  class="black--text"
                  label="Middle Name"
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'middleName', 'Middle Name')"
                  @input="$v.spouse.$each[index].middleName.$touch()"
                  @blur="$v.spouse.$each[index].middleName.$touch()"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5">
                <v-text-field
                  :id="`spouseEmail${index}`"
                  v-model="content.email"
                  class="black--text"
                  label="Email Address"
                  type="email"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'email', 'Email Address')"
                  @input="$v.spouse.$each[index].email.$touch()"
                  @blur="$v.spouse.$each[index].email.$touch()"
                />
              </v-col>
              <v-col cols="5">
                <DateComponent
                  :id="`spouseBirthday${index}`"
                  v-model="content.birthday"
                  :value="content.birthday"
                  label="Birthday"
                  :is-dense="false"
                  placeholder="YYYY-MM-DD"
                  date-class="black--text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'birthday', 'Birthday')"
                  @input="() => {
                    $v.spouse.$each[index].birthday.$touch()
                    content.age = handleSpouseAge(content.birthday)
                  }"
                  @blur="$v.spouse.$each[index].birthday.$touch()"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  :id="`spouseAge${index}`"
                  v-model="content.age"
                  class="black--text"
                  label="Age"
                  type="text"
                  disabled
                  :error-messages="collectionError('spouse', index, 'age', 'Age')"
                  @input="$v.spouse.$each[index].age.$touch()"
                  @blur="$v.spouse.$each[index].age.$touch()"
                />
              </v-col>
            </v-row>
            <v-row
              align-self="start"
              justify="center"
            >
              <v-col cols="5">
                <v-text-field
                  :id="`spouseTin${index}`"
                  v-model="content.tin"
                  class="black--text"
                  label="TIN"
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'tin', 'TIN')"
                  @input="$v.spouse.$each[index].tin.$touch()"
                  @blur="$v.spouse.$each[index].tin.$touch()"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  :id="`spouseTelephone${index}`"
                  v-model="content.telephone"
                  class="black--text"
                  label="Tel. No."
                  type="text"
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'telephone', 'Tel. No.')"
                  @input="$v.spouse.$each[index].telephone.$touch()"
                  @blur="$v.spouse.$each[index].telephone.$touch()"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  :id="`spouseMobile${index}`"
                  v-model="content.mobile"
                  class="black--text"
                  label="Mobile No."
                  :outlined="editable"
                  :disabled="!editable"
                  :error-messages="collectionError('spouse', index, 'mobile', 'Mobile No.')"
                  @input="$v.spouse.$each[index].mobile.$touch()"
                  @blur="$v.spouse.$each[index].mobile.$touch()"
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
import Address from '@/components/applications/Address'
import { mapFields } from 'vuex-map-fields'
import application from '@/store/application'
import users from '@/store/users'
import crud from '@/rest/crud'
import { DateComponent, LookUpSelect } from 'maroon-vue-components'

export default {
  name: 'ApplicantsForm',
  components: {
    Address,
    DateComponent,
    LookUpSelect
  },
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  data: () => ({
    separationOptions: ['Legal', 'Non-Legal'],
    sameAsPresent: false,
    radioButtonOptions: [
      'Single',
      'Married',
      'Separated',
      'Widow/er'
    ],
    ownership: [
      'Owned',
      'Mortgage',
      'Rented',
      'Used Free'
    ],
    userInfo: {}
  }),
  computed: {
    ...validationErrors,
    id () {
      return this.$route.params.id
    },
    isExternal () {
      return this.$s.userType === 'External'
    },
    ...mapFields('users', {
      applicantLastName: 'info.lastName',
      applicantFirstName: 'info.firstName',
      applicantMiddleName: 'info.middleName',
      applicantEmail: 'info.email',
      applicantTelephone: 'info.telephone',
      applicantMobile: 'info.mobile'
    }),
    ...mapFields('application', {
      user: 'user',
      applicantBirthday: 'birthday',
      applicantAge: 'age',
      applicantTin: 'tin',
      applicantMaritalStatus: 'maritalStatus',
      applicantCitizenship: 'citizenship',
      presentAddressLengthOfStay: 'presentAddress.lengthOfStay',
      presentAddressNoOfDependents: 'presentAddress.noOfDependents',
      presentAddressOwnership: 'presentAddress.ownership',
      previousAddressLengthOfStay: 'previousAddress.lengthOfStay',
      presentAddress: 'presentAddress',
      previousAddress: 'previousAddress',
      spouse: 'spouse',
      spouseEmployment: 'spouseEmployment',
      typeOfSeparation: 'typeOfSeparation'
    })
  },
  watch: {
    user: {
      async handler (obj) {
        await this.getUser(obj)
      },
      deep: true
    }
  },
  validations () {
    return custom.applicants
  },
  beforeCreate () {
    if (!this.$store.hasModule('users')) {
      this.$store.registerModule('users', users)
    }
    if (!this.$store.hasModule('application')) {
      this.$store.registerModule('application', application)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('application/reset')
    this.$store.dispatch('users/reset')
  },
  async created () {
    if (this.isExternal && this.operation === 'create') {
      this.user = this.$s.user
    }
  },
  methods: {
    addCoMaker () {
      if (this.spouse && this.spouse.length < 3) {
        this.spouse.push({
          firstName: undefined,
          middleName: undefined,
          lastName: undefined,
          age: undefined,
          birthday: undefined,
          tin: undefined,
          telephone: undefined,
          mobile: undefined,
          email: undefined
        })
        this.spouseEmployment.push({
          type: undefined,
          name: undefined,
          address: undefined,
          position: undefined,
          telephone: undefined,
          years: undefined,
          monthlyIncome: undefined,
          otherSourceOfIncome: undefined
        })
      }
    },
    removeComaker (index) {
      if (this.spouse && this.spouse.length) {
        this.spouse.splice(index, 1)
        this.spouseEmployment.splice(index, 1)
      }
    },
    handleAge () {
      const birthDate = new Date(this.applicantBirthday)
      const ageDifMs = Date.now() - birthDate.getTime()
      const ageDate = new Date(ageDifMs) // miliseconds from epoch
      const age = Math.abs(ageDate.getUTCFullYear() - 1970)
      this.applicantAge = age
    },
    handleSpouseAge (birthday) {
      const birthDate = new Date(birthday)
      const ageDifMs = Date.now() - birthDate.getTime()
      const ageDate = new Date(ageDifMs) // miliseconds from epoch
      const age = Math.abs(ageDate.getUTCFullYear() - 1970)
      return age
    },
    sameAsPresentAction () {
      if (this.sameAsPresent) {
        for (const key in this.presentAddress) {
          Object.prototype.hasOwnProperty.call(this.previousAddress, key) && (this.previousAddress[key] = this.presentAddress[key])
        }
      } else {
        this.$store.dispatch('application/resetCustomObject', 'previousAddress')
      }
    },
    async getUser (id) {
      const data = await crud('admin/user/profile').read(id)
      this.$store.dispatch('users/set', data.entry)
    }
  }
}
</script>
