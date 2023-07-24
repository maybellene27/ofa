<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height mt-n15"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="5"
          >
            <v-card
              class="rounded-lg elevation-12 pt-10 px-15 pb-1"
              tile
            >
              <v-card-text>
                <v-row>
                  <v-col>
                    <p class="header mt-3">
                      Forgot Password
                    </p>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <p class="subtitle mt-n4 mb-5">
                      Don't you worry we will send you an
                    </p>
                    <p class="subtitle mt-n4 mb-5">
                      email to reset your password
                    </p>
                  </v-col>
                </v-row>
                <v-form lazy-validation>
                  <v-text-field
                    id="email"
                    v-model.trim="email"
                    label="Email Address"
                    class="black--text required-field mt-3 mb-n5 px-1"
                    type="email"
                    outlined
                    :error-messages="emailError"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-row>
                  <v-col class="px-6">
                    <v-btn
                      color="primary"
                      block
                      type="button"
                      :loading="$data.$meta.loading"
                      @click="submit"
                    >
                      {{ $data.$meta.forms.passReset.button }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-card-actions>
                <v-row>
                  <v-col>
                    <p class="back mt-3">
                      Back to<a
                        class="blue--text text-decoration-underline pl-1"
                        @click="$router.push({
                          name: 'Login'
                        })"
                      >Sign in</a>
                    </p>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { metaMixin, errors } from '@/meta'
import password from '@/utils/webapi/password'

export default {
  name: 'PassReset',
  mixins: [validationMixin, metaMixin],
  data: () => ({
    email: '',
    $meta: {
      loading: false
    }
  }),
  validations: {
    email: custom.email
  },
  computed: {
    ...validationErrors
  },
  methods: {
    async submit () {
      const { $meta } = this.$data
      this.$v.$touch()
      if (!this.$v.$invalid) {
        $meta.loading = true
        const resp = await password.request.reset(this.email)
        resp && ($meta.loading = false)
        if (resp.ok) {
          this.$store.dispatch('showAlert', {
            message: $meta.forms.passReset.success,
            type: 'success'
          })
        } else {
          this.$store.dispatch('showAlert', {
            message: errors.generic,
            type: 'error'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.header, .subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #005C9F;
  position: relative;
  font-family: Open Sans, Avenir, Helvetica, Arial, sans-serif;
}

.back {
  display: flex;
  justify-content: center;
  align-items: center;
}

.subtitle { font-size: 20px; }

a { font-weight: bold; }

.header {
  font-weight: 800;
  font-size: 30px;
}
</style>
