<template>
  <v-container>
    <v-row
      class="mt-5"
    >
      <v-col>
        <v-btn
          id="backBtn"
          color="grey"
          outlined
          class="px-10"
          @click="$router.go(-1)"
        >
          <div class="px-2">
            Back
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="5"
      >
        <v-card
          class="rounded-lg mb-10 card"
          tile
        >
          <v-toolbar
            flat
            class="header"
            color="#005C9F"
          >
            <v-toolbar-title>
              <b>{{ $data.$meta.forms.changePass.title }}</b>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form lazy-validation>
              <v-text-field
                id="oldPassword"
                v-model.trim="oldPassword"
                label="Old Password"
                :error-messages="genericError('oldPassword', 'Old Password')"
                :append-icon="$data.$password.show0 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="$data.$password.show0 ? 'text' : 'password'"
                filled
                class="px-6 mt-5"
                @input="$v.oldPassword.$touch()"
                @blur="$v.oldPassword.$touch()"
                @click:append="$data.$password.show0 = !$data.$password.show0"
              />
              <v-text-field
                id="password"
                v-model.trim="password"
                label="Password"
                :error-messages="genericError('password', 'Password')"
                :append-icon="$data.$password.show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="$data.$password.show1 ? 'text' : 'password'"
                filled
                class="px-6"
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                @click:append="$data.$password.show1 = !$data.$password.show1"
              />
              <v-text-field
                id="confirmPassword"
                v-model.trim="confirmPassword"
                label="Confirm Password"
                :error-messages="confirmPasswordError"
                :append-icon="$data.$password.show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="$data.$password.show2 ? 'text' : 'password'"
                filled
                class="px-6"
                @input="$v.confirmPassword.$touch()"
                @blur="$v.confirmPassword.$touch()"
                @click:append="$data.$password.show2 = !$data.$password.show2"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row class="px-10">
              <v-col>
                <v-btn
                  v-if="showLabel('canChangePassword')"
                  color="#005C9F"
                  type="button"
                  class="btn rounded-lg mb-4"
                  :loading="$data.$loading"
                  block
                  @click="submit"
                >
                  {{ getLabel('canChangePassword', $data.$meta.forms.changePass.button) }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { sameAs } from 'vuelidate/lib/validators'
import { metaMixin, errors } from '@/meta'
import password from '@/utils/webapi/password'
import { privilegeMixin } from 'session-plugin'

export default {
  name: 'Security',
  components: {
  },
  mixins: [validationMixin, metaMixin, privilegeMixin],
  data: () => ({
    oldPassword: '',
    password: '',
    confirmPassword: '',
    $password: {
      show0: false,
      show1: false,
      show2: false
    },
    $loading: false
  }),
  validations: {
    password: custom.password,
    oldPassword: custom.password,
    confirmPassword: {
      ...custom.password,
      sameAs: sameAs('password')
    }
  },
  computed: {
    ...validationErrors,
    userRole () {
      return this.$route.params.userRole || this.$route.path.split('/')[1]
    }
  },
  created () {
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$data.$loading = true

        const resp = await password.request.change(this.oldPassword)
        const jData = await resp.json()
        if (resp.ok) {
          this.finishChangePass(jData.otp)
        } else if (jData.error === 'Incorrect password.') {
          this.$store.dispatch('showAlert', {
            message: 'Old password is incorrect. Please input correct password.',
            type: 'error'
          })
          this.$data.$loading = false
        } else {
          this.$store.dispatch('showAlert', {
            message: errors.generic,
            type: 'error'
          })
          this.$data.$loading = false
        }
      }
    },
    async finishChangePass (otp) {
      this.$data.$loading = true
      const resp = await password.change(otp, this.password)
      resp && (this.$data.$loading = false)
      if (resp.ok) {
        const jData = await resp.json()
        this.$store.dispatch('showAlert', {
          message: jData.message,
          type: 'success'
        })
        this.clear()
      } else {
        this.$store.dispatch('showAlert', {
          message: errors.generic,
          type: 'error'
        })
        this.$data.$alert.show = true
      }
    },
    clear () {
      this.$v.$reset()
      this.oldPassword = ''
      this.password = ''
      this.confirmPassword = ''
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.btn { color: white; }
</style>
