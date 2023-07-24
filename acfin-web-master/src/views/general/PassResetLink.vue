<template>
  <v-app id="inspire">
    <AppBar>
      <template v-slot:title>
        {{ $data.$meta.forms.signup.title }}
      </template>
    </AppBar>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card
            class="elevation-12"
            tile
            :loading="$data.$meta.isLoading"
          >
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Change Password</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <PasswordForm
                ref="passwordForm"
                :can-edit="!$data.$meta.readOnly"
                v-bind="{ password, confirmPassword }"
                is-reset-password
                :loading="$data.$meta.isLoading"
                @change="$data[$event.key] = $event.value"
              />
            </v-card-text>
            <v-card-actions>
              <router-link
                v-if="!$data.$meta.isLoading"
                class="nav-link"
                :to="{name: 'Login'}"
              >
                <v-btn text>
                  Back to Login
                </v-btn>
              </router-link>
              <v-spacer />
              <v-btn
                color="primary"
                type="button"
                :loading="$data.$meta.isLoading"
                @click="resetPassword"
              >
                Change Password
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import AppBar from '@/components/base/AppBar'
import PasswordForm from '@/components/security/PasswordForm'
import { metaMixin } from '@/meta'
import password from '@/utils/webapi/password'
import { validationMixin, validationErrors } from '@/utils/validations'

export default {
  name: 'PassResetLink',
  components: {
    AppBar,
    PasswordForm
  },
  mixins: [metaMixin, validationMixin],
  data: () => ({
    password: '',
    confirmPassword: '',
    $meta: {
      isLoading: false
    },
    $opts: {
      password: {
        show: false,
        showConfirm: false
      }
    }
  }),
  computed: {
    ...validationErrors,
    isInvalid () {
      let invalid
      for (const form in this.$refs) {
        const ref = this.$refs[form]
        if (ref.$v && !invalid) {
          invalid = ref.$v.$invalid
        }
      }
      return invalid
    }
  },
  methods: {
    async resetPassword () {
      this.validate()
      if (!this.isInvalid) {
        this.$data.$meta.isLoading = true
        const { query } = this.$route
        const resp = await password.emailChangePassword(query.username, query.otp, this.password)
        const jData = await resp.json()
        this.$data.$meta.isLoading = false
        if (resp.ok) {
          this.$store.dispatch('showAlert', {
            message: 'Successfully changed password.',
            type: 'success'
          })
          this.$router.push({ name: 'Login' })
        } else {
          this.$store.dispatch('showAlert', {
            message: jData.error || jData.message,
            type: 'error'
          })
        }
      }
    },
    validate () {
      for (const form in this.$refs) {
        const ref = this.$refs[form]
        if (ref.$v) {
          ref.$v.$touch()
        }
      }
    }
  }
}
</script>
