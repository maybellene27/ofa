<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="400"
      persistent
    >
      <v-card>
        <v-card-title class="text lighten-2">
          {{ statusMessage }} user?
        </v-card-title>
        <p class="px-5">
          {{ message }}
        </p>
        <v-textarea
          v-if="!isActivate"
          v-model="reason"
          outlined
          class="pa-5"
          name="input-7-4"
          required
          :error-messages="errorMsg"
          label="Reasons"
        />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="handleCancel()"
          >
            Cancel
          </v-btn><v-btn
            color="primary"
            text
            @click="handleSubmit()"
          >
            {{ statusMessage }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'CustomDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    reason: ''
  }),
  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    },
    errorMsg () {
      return ''
    },
    statusMessage () {
      return this.isActivate ? 'Activate' : 'Deactivate'
    },
    message () {
      return this.isActivate ? 'This will activate the user and can have access capability' : 'The user will lose capability to the system'
    },
    isActivate () {
      return this.status
    }
  },
  methods: {
    handleSubmit () {
      if (!this.reason) {
        this.reason = 'No reason for account deactivation'
      }
      this.dialog = false
      this.$emit('reason', this.reason)
    },
    handleCancel () {
      this.dialog = false
    }
  }
}
</script>
