<template>
  <Card
    :tile="cardTile"
    :flat="cardFlat"
    :show-title="!!title"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <template v-slot:content>
      <v-text-field
        id="password"
        :label="passwordLabel"
        :outlined="canEdit"
        :readonly="!canEdit || loading"
        :value="password"
        :error-messages="passwordError"
        :append-icon="$data.$opts.password.show ? 'mdi-eye' : 'mdi-eye-off'"
        :type="$data.$opts.password.show ? 'text' : 'password'"
        class="required-field"
        @input="handler('password', $event)"
        @blur="$v.password.$touch()"
        @change="handler('password', $event.trim())"
        @click:append="$data.$opts.password.show = !$data.$opts.password.show"
      />
      <v-text-field
        id="confirmPassword"
        label="Confirm Password"
        :outlined="canEdit"
        :readonly="!canEdit || loading"
        :value="confirmPassword"
        :error-messages="confirmPasswordError"
        :append-icon="$data.$opts.password.showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
        :type="$data.$opts.password.showConfirm ? 'text' : 'password'"
        class="required-field"
        @input="handler('confirmPassword', $event)"
        @blur="$v.confirmPassword.$touch()"
        @change="handler('confirmPassword', $event.trim())"
        @click:append="$data.$opts.password.showConfirm = !$data.$opts.password.showConfirm"
      />
      <span class="black--text">Password must be between 10 and 15 characters.</span>
    </template>
  </Card>
</template>

<script>
import { custom, validationErrors, validationMixin } from '@/utils/validations'
import Card from '@/components/etc/Card'
import { sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'PasswordForm',
  components: {
    Card
  },
  mixins: [validationMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    isResetPassword: {
      type: Boolean,
      default: false
    },
    loading: Boolean,
    password: { type: String, default: undefined },
    confirmPassword: { type: String, default: undefined },
    cardFlat: {
      type: Boolean,
      default: true
    },
    cardTile: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    $opts: {
      password: {
        show: false,
        showConfirm: false
      }
    }
  }),
  computed: {
    ...validationErrors,
    passwordLabel () {
      return this.$props.isResetPassword ? 'New Password' : 'Password'
    }
  },
  validations: {
    password: custom.password,
    confirmPassword: {
      ...custom.password,
      sameAs: sameAs('password')
    }
  },
  created () {
    this.$emit('validation', this.$v)
  },
  methods: {
    handler (key, value) {
      this.$emit('change', { key, value })
      this.$v[key] && this.$v[key].$touch()
    }
  }
}
</script>

<style scoped>
  .v-icon--link {
    pointer-events: auto;
  }

  .v-input >>> input[type=number]::-webkit-outer-spin-button,
  .v-input >>> input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .v-input >>> input[type=number] {
    -moz-appearance: textfield;
  }
</style>
