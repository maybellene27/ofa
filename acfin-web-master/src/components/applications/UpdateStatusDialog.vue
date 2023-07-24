<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="480"
    >
      <v-card>
        <v-card-text>
          <p class="text-h5 header-padding text-center">
            Application Status Update
          </p>

          <p class="text-center">
            This will update the status of the application to <span class="text-approved">Approved and Released</span> or <span class="text-maroon">Canceled Approval</span>
          </p>

          <p class="text-center">
            Choose among the two choices:
          </p>

          <div class="flex-between">
            <v-btn
              dense
              color="success"
              @click="choice('approve')"
            >
              Approve and Release
            </v-btn>
            <v-btn
              dense
              :style="{'background-color':'maroon','color':'#fff'}"
              @click="choice('cancel')"
            >
              Cancel Approval
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'UpdateStatusDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
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
    choice (name) {
      name === 'approve' && this.$emit('choice', name)
      name === 'cancel' && this.$emit('choice', name)
    }
  }
}
</script>

<style scoped>
.header-padding {
  padding-top: 20px;
}
.text-center {
  text-align: center;
}
.flex-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
}
.text-maroon {
  color: maroon;
}
.text-approved {
  color: #4caf50;
}
</style>
