const alertMixin = {
  data: () => ({
    $meta: {
      alert: {
        type: 'success',
        show: false,
        message: '',
        callback: null
      },
      alertArr: []
    }
  }),
  methods: {
    showAlert ({ message, type, callback, override }) {
      const { alertArr, alert } = this.$data.$meta
      if (override) {
        alertArr.length = 0
        this.$data.$meta.alert.show = false
      }
      alertArr.push({
        message, type, callback
      })
      alert.show || this.show(alertArr.shift())
    },
    bubbleAlert ({ message, type, callback, override }) {
      this.$emit('alert', { message, type, callback, override })
    },
    show ({ message, type, callback }) {
      this.$data.$meta.alert.message = message
      this.$data.$meta.alert.show = true
      this.$data.$meta.alert.type = type
      this.$data.$meta.alert.callback = callback
    }
  },
  watch: {
    '$data.$meta.alert.show': async function (val) {
      const { alertArr, alert } = this.$data.$meta
      if (!val) {
        alert.callback && alert.callback()
        await this.$nextTick
        alertArr.length && this.show(alertArr.shift())
      }
    }
  }
}

export default alertMixin
