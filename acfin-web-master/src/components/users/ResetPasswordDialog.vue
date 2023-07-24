<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card
            class="pa-5"
            tile
            :loading="$data.$meta.loading"
          >
            <v-row>
              <v-col>
                <div
                  class="d-flex justify-center"
                >
                  Don't you worry we will send an
                </div>
                <div
                  class="d-flex justify-center"
                >
                  email to reset {{ email }} password
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-form lazy-validation>
                  <v-text-field
                    id="email"
                    v-model.trim="email"
                    label="Email Address"
                    class="black--text required-field mt-3 mb-n5 px-1"
                    type="email"
                    :outlined="false"
                    :disabled="true"
                    :loading="$data.$meta.loading"
                    :error-messages="emailError"
                    @input="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                  />
                </v-form>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                class="d-flex"
              >
                <v-btn
                  class="px-10"
                  :loading="$data.$meta.loading"
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  class="px-10 white--text"
                  color="primary"
                  :loading="$data.$meta.loading"
                  @click="submit"
                >
                  {{ $data.$meta.forms.passReset.button }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { metaMixin, errors } from '@/meta'
import password from '@/utils/webapi/password'

export default {
  name: 'ResetPasswordDialog',
  mixins: [validationMixin, metaMixin],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    },
    email: {
      type: String,
      default: ''
    }
  },
  validations: {
    email: custom.email
  },
  data: () => ({
    $meta: {
      loading: false
    }
  }),
  computed: {
    ...validationErrors,
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
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
          this.dialog = false
          this.$store.dispatch('showAlert', {
            message: $meta.forms.passReset.success,
            type: 'success'
          })
        } else {
          this.dialog = false
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
