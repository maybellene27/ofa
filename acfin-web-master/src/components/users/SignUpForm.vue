<template>
  <v-card class="py-7 card rounded-xl">
    <v-row
      justify="center"
      align="center"
      class="pt-2"
    >
      <div
        class="py-8"
        justify="center"
        align="center"
      >
        <h1>Register an account</h1>
      </div>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="pt-2"
    >
      <v-col cols="8">
        <v-text-field
          id="lastName"
          v-model="lastName"
          class="black--text required-field"
          label="Last Name"
          :loading="loading"
          type="text"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('lastName','Last name')"
          @input="$v.lastName.$touch()"
          @blur="$v.lastName.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="firstName"
          v-model="firstName"
          class="black--text required-field"
          :loading="loading"
          label="First Name"
          type="text"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('firstName', 'First name')"
          @input="$v.firstName.$touch()"
          @blur="$v.firstName.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="middleName"
          v-model="middleName"
          class="black--text"
          label="Middle Name"
          type="text"
          :loading="loading"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('middleName', 'Middle name')"
          @input="$v.middleName.$touch()"
          @blur="$v.middleName.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="telephone"
          v-model="telephone"
          class="black--text"
          label="Telephone No."
          :loading="loading"
          :outlined="editable && !profile"
          :disabled="!editable || profile"
          @input="$v.telephone.$touch()"
          @blur="$v.telephone.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="mobile"
          v-model="mobile"
          class="black--text required-field"
          label="Mobile Number"
          :loading="loading"
          :outlined="editable && !profile"
          :disabled="!editable || profile"
          :error-messages="genericError('mobile', 'Mobile')"
          @input="$v.mobile.$touch()"
          @blur="$v.mobile.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="email"
          v-model="email"
          class="black--text required-field"
          label="Email Address"
          type="email"
          :loading="loading"
          :outlined="editable && !profile"
          :disabled="!editable || profile"
          :error-messages="genericError('email', 'Email address')"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="password"
          v-model.trim="password"
          label="Password"
          class="black--text required-field"
          outlined
          :loading="loading"
          background-color="white"
          :error-messages="genericError('password', 'Password')"
          :append-icon="$data.$meta.password.show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="$data.$meta.password.show ? 'text' : 'password'"
          @input="$v.password.$touch()"
          @blur="$v.password.$touch()"
          @click:append="$data.$meta.password.show = !$data.$meta.password.show"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-text-field
          id="confirmPassword"
          v-model="confirmPassword"
          label="Confirm Password"
          class="black--text required-field"
          outlined
          :loading="loading"
          background-color="white"
          :append-icon="$data.$meta.confirmPassword.show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="$data.$meta.confirmPassword.show ? 'text' : 'password'"
          :error-messages="confirmPasswordError"
          @input="$v.confirmPassword.$touch()"
          @blur="$v.confirmPassword.$touch()"
          @click:append="$data.$meta.confirmPassword.show = !$data.$meta.confirmPassword.show"
        />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n12"
    >
      <v-col cols="8">
        <div class="d-flex">
          <v-checkbox
            id="termAndCondition"
            v-model="termAndCondition"
          />
          <span class="mt-5">
            I agree to follow the
            <a
              class="blue--text text-decoration-underline"
              @click.stop="termAndConditionDialog = true"
            >
              Terms and Conditions
            </a>
            <TermAndCondition
              v-model="termAndConditionDialog"
            />
          </span>
        </div>
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="mt-n6"
    >
      <v-col cols="8">
        <v-btn
          color="primary"
          type="button"
          block
          @click.stop="confirmDialog()"
        >
          Sign Up
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align="center"
      class="my-10"
    >
      <p>
        Already have an account? <span
          id="signInHereBtn"
          @click="$router.push({ name: 'Login' })"
        ><u>Sign in here</u></span>
      </p>
    </v-row>
  </v-card>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'
import { sameAs } from 'vuelidate/lib/validators'
import TermAndCondition from './TermsAndCondition'

export default {
  name: 'SignUpForm',
  components: {
    TermAndCondition
  },
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean,
    profile: {
      type: Boolean,
      default: false
    },
    create: { type: Object, default: () => {} }
  },
  data: () => ({
    $meta: {
      password: {
        show: false
      },
      confirmPassword: {
        show: false
      }
    },
    termAndCondition: false,
    termAndConditionDialog: false
  }),
  computed: {
    ...validationErrors,
    ...mapFields('users', {
      lastName: 'info.lastName',
      firstName: 'info.firstName',
      middleName: 'info.middleName',
      telephone: 'info.telephone',
      mobile: 'info.mobile',
      email: 'info.email',
      password: 'info.password',
      confirmPassword: 'info.confirmPassword'
    }),
    loading () {
      return this.create.loading
    }
  },
  methods: {
    agree (obj) {
      this.$nextTick(() => {
        this.TermAndCondition = obj
      })
    },
    async confirmDialog () {
      this.$v.$touch()
      if (this.termAndCondition) {
        this.create.confirmDialog({
          title: 'Create User',
          message: 'This will create a new user to the system',
          showDialog: true,
          callback: async () => {
            this.create.save(() => {
              this.$router.push({
                name: 'Login'
              })
            })
          }
        })
      } else {
        this.$store.dispatch('showAlert', {
          message: 'You must agree to follow Terms and conditions',
          type: 'error'
        })
      }
    }
  },
  validations () {
    const {
      lastName,
      firstName,
      middleName,
      telephone,
      mobile,
      email,
      password
    } = custom.users(this)
    return {
      lastName,
      firstName,
      middleName,
      telephone,
      mobile,
      email,
      password,
      confirmPassword: {
        ...password,
        sameAs: sameAs('password')
      }
    }
  }
}
</script>

<style scoped>
h1, span:first-child { color: #005C9F; }
h1 { font-weight: 1000; }

span:first-child {
  font-weight: bold;
  cursor: pointer;
}

.card {
  margin-left: 300px;
  margin-right: 300px;
}

@media only screen and (max-width: 1264px) {
  .card {
    margin-left: 150px;
    margin-right: 150px;
  }
}

@media only screen and (max-width: 845px) {
  .card {
    margin-left: 100px;
    margin-right: 100px;
  }
}

@media only screen and (max-width: 768px) {
  .card {
    margin-left: 80px;
    margin-right: 80px;
  }
}

@media only screen and (max-width: 640px) {
  .card {
    margin-left: 0px;
    margin-right: 0px;
  }
}
</style>
