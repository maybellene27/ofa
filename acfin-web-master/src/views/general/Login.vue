<template>
  <div class="layout">
    <v-container
      class="fill-height container"
      fluid
      :style="`background-color: ${$metaData.app.login.background}`"
      width="50%"
    >
      <v-col
        cols="12"
        class="padding"
      >
        <p class="signin text-center font-weight-black pt-8 pb-7">
          Login to your account
        </p>
        <v-form lazy-validation>
          <v-text-field
            id="username"
            v-model.trim="username"
            label="Username"
            name="username"
            prepend-icon="person"
            type="text"
            outlined
            background-color="white"
            :error-messages="genericError('username', 'Username')"
            @input="$v.username.$touch()"
            @blur="$v.username.$touch()"
            @keyup.enter="submit(false)"
          />
          <v-text-field
            id="password"
            v-model.trim="password"
            label="Password"
            name="password"
            prepend-icon="lock"
            outlined
            background-color="white"
            :error-messages="genericError('password', 'Password')"
            :append-icon="$data.$meta.password.show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="$data.$meta.password.show ? 'text' : 'password'"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
            @keyup.enter="submit(false)"
            @click:append="$data.$meta.password.show = !$data.$meta.password.show"
          />
        </v-form>
        <v-row
          style="padding: 0px 30px; padding-right: 3px;"
        >
          <v-col>
            <v-btn
              id="loginBtn"
              color="primary"
              type="button"
              block
              @click.stop="submit(false)"
            >
              Sign in
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          justify="center"
        >
          <v-col
            cols="6"
            class="d-flex justify-center"
          >
            <span><a
              class="blue--text"
              @click="$router.push({
                name: 'PassReset'
              })"
            >Forgot Password?</a></span>
          </v-col>
        </v-row>
        <v-row
          justify="center"
        >
          <v-col
            class="d-flex justify-center"
          >
            <span>Create an account? <a
              class="blue--text"
              @click="openSignupPage()"
            > Sign up</a></span>
          </v-col>
        </v-row>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
const { username, password } = custom

export default {
  mixins: [validationMixin],
  data: () => ({
    dialog: false,
    username: '',
    password: '',
    $meta: {
      password: {
        show: false
      }
    }
  }),
  validations: {
    username,
    password
  },
  computed: {
    ...validationErrors
  },
  created () {
    this.username = this.$route.params.username
  },
  mounted () {
    if (this.username) {
      this.showAlert({
        message: 'Please remember this username. You will use it every time you login to the system.',
        type: 'info'
      })
    }
  },
  methods: {
    openSignupPage () {
      this.$router.push({
        name: 'Signup',
        params: {
          operation: 'create'
        }
      })
    },
    submit: async function (forceful) {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        const { $meta, ...creds } = this.$data
        const resp = await this.$s.login(creds, forceful)
        if (!resp.ok) {
          let { error } = this.$s
          const lockedMessage = ['User is locked out.', 'User is now locked out.']
          const isLocked = lockedMessage.some(message => error.includes(message))
          isLocked && (error = 'Account Locked. You can try to login again after 3 minutes.')

          if (error.includes('Maximum number of sessions has been reached.')) {
            this.$store.dispatch('showDialog', {
              title: 'Multiple Logins',
              message: 'You are currently logged in on another device. Do you want to log out all of your existing sessions?',
              callback: () => { this.submit(true) }
            })
            return
          }
          this.$store.dispatch('showAlert', {
            message: error,
            type: 'error'
          })
        } else {
          this.redirect()
        }
      }
    },
    async redirect () {
      await this.$s.ready
      if (this.$s.userType === 'Internal') {
        if (this.$s.userRole.includes('systemAdmin')) {
          this.$router.push({
            name: 'FinancingPartnerTable',
            params: {
              page: 1
            }
          })
        } else {
          this.$router.push({
            name: 'ApplicationTable',
            params: {
              page: 1
            }
          })
        }
      } else {
        if (this.$s.userRole.includes('bankApprover')) {
          this.$router.push({
            name: 'BankApproverApplicationTable',
            params: {
              page: 1
            }
          })
        } else {
          this.$router.push({
            name: 'ApplicantApplicationTable',
            params: {
              page: 1
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
  .container {
    padding: 0px;
    margin: 0px;
  }
  .signin {
    font-size: 35px;
    padding-left: 20px;
    font-weight: 300;
    color: #1565C0;
  }
  .padding {
    padding: 30px 100px;
    margin-right: auto;
  }
  .layout {
    padding: 3% 25% 6% 25%;
  }
</style>
