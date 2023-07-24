<template>
  <v-menu
    ref="menu"
    v-model="$data.menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on: { click } }">
      <v-text-field
        :id="id"
        v-model="inputDate"
        :label="label"
        :placeholder="placeholder"
        append-icon="event"
        :class="dateClass"
        :disabled="disabled"
        :outlined="outlined"
        :value="inputDate"
        :dense="isDense"
        :error-messages="errorMessages"
        @click:append="click"
      />
    </template>
    <v-date-picker
      v-if="noTitle"
      ref="picker"
      v-model="inputDate"
      :type="pickerType"
      no-title
      :max="max"
      :min="min"
      @click:year="saveDate($event)"
    />
    <v-date-picker
      v-else
      ref="picker"
      v-model="inputDate"
      :type="pickerType"
      @change="saveDate"
    />
  </v-menu>
</template>

<script>
export default {
  model: {
    prop: 'val',
    event: 'input'
  },
  props: {
    placeholder: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    pickerType: {
      type: String,
      default: 'date'
    },
    max: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    dateClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: true
    },
    errorMessages: {
      type: Array,
      default: () => {}
    },
    isDense: {
      type: Boolean,
      default: true
    },
    noTitle: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    menu: false,
    inputDate: ''
  }),
  watch: {
    inputDate (val) {
      this.$emit('input', val)
    },
    '$props.value' () {
      this.inputDate = this.$props.value
    },
    menu (val) {
      if (this.$props.noTitle === true) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
      }
    }
  },
  created () {
    if (this.$props.value) {
      this.inputDate = this.$props.value
    }
  },
  methods: {
    saveDate (date) {
      const dateString = typeof date === 'number' ? date.toString() : date
      this.inputDate = dateString
      this.$refs.menu.save(dateString)
      this.$refs.picker.activePicker = 'YEAR'
      this.$emit('input', dateString)
      this.menu = false
    }
  }
}
</script>
