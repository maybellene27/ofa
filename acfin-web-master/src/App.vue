<template>
  <v-app
    id="inspire"
  >
    <router-view
      @alert="showAlert($event)"
      @dialog="showDialog($event)"
    />
    <Alert
      :show="alert.show"
      :message="alert.message"
      :type="alert.type"
      :list="alert.list"
      @update:show="alert.show = $event"
    />
    <v-overlay :value="alert.show" />
    <Dialog
      v-model="dialog.show"
      v-bind="dialog"
    />
  </v-app>
</template>

<script>
import { Alert, Dialog } from 'maroon-vue-components'
import { mapGetters } from 'vuex'
import '@/locals/crudFormComponents'
import masterData from '@/store/masterData'

export default {
  name: 'App',
  components: {
    Alert,
    Dialog
  },
  data: () => ({
    hasPreExpireMessage: false,
    showingExpireMessage: false
  }),
  computed: {
    ...mapGetters({
      alert: 'getAlert',
      dialog: 'getDialog'
    })
  },
  created () {
    this.init()
  },
  beforeUpdate () {
    this.setSessionExpirationWarning()
  },
  beforeCreate () {
    if (!this.$store.hasModule('masterData')) {
      this.$store.registerModule('masterData', masterData)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/resetAll')
  },
  methods: {
    async init () {
      await this.$s.ready
    },
    async setSessionExpirationWarning () {
      const self = this
      if (!self.hasPreExpireMessage) {
        self.$s.beforeExpire.push(() => {
          self.showingExpireMessage = true
          this.$store.dispatch('showAlert', {
            message: 'Your session is about to expire. Close this warning to refresh your session.',
            type: 'error',
            callback: () => {
              self.showingExpireMessage = false
              self.$data.$meta.alert.message = ''
              self.$s.refresh()
            }
          })
        })
        self.hasPreExpireMessage = true
      }
    }
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-alert {
  position: fixed !important;
  top: 30%;
  margin: auto;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.v-application a {
  text-decoration: none;
  color: inherit !important;
}

.v-stepper,
.v-dialog,
.v-list,
.v-menu__content {
  border-radius: 0 !important;
}

.v-chip--disabled {
  opacity: 1;
}

main {
  background: whitesmoke;
}
.v-input--is-readonly.v-select .v-input__icon.v-input__icon--append,
.v-input--is-readonly.v-select .v-input__icon.v-input__icon--clear{
  display: none !important;
}

.v-card__title {
  word-break: normal !important;
}

.required-field .v-label::after {
  content: '*';
  color: #e74c3c;
  margin-left: 5px;
}

.theme--light.v-input--is-disabled input, .theme--light.v-input--is-disabled textarea {
  color: black;
}
</style>

<style lang="scss">
.status {
  &.approved,
  &.pass,
  &.completed,
  &.pass input,
  &.completed input,
  &.approved input {
    color: #27ae60 !important;
    text-transform: uppercase;
    font-weight: bold;
  }
  &.rejected,
  &.fail,
  &.fail input,
  &.rejected input {
    color: #c0392b !important;
    text-transform: uppercase;
    font-weight: bold;
  }
  &.started,
  &.started input {
    color: darkgoldenrod !important;
    text-transform: uppercase;
    font-weight: bold;
  }
  &.pending,
  &.pending input {
    color: #95a5a6 !important;
    text-transform: uppercase;
    font-weight: bold;
  }
}
</style>
