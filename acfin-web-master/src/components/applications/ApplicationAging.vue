<template>
  <v-container
    fluid
  >
    <div
      class="d-flex justify-center"
    >
      <v-progress-circular
        :rotate="360"
        :size="60"
        :width="5"
        :value="age"
        color="blue darken-4"
      >
        {{ displayValue(age) }}
      </v-progress-circular>
    </div>
    <div
      class="caption d-flex justify-center"
    >
      Aging for
    </div>
    <div
      class="caption d-flex justify-center"
    >
      {{ type }}
    </div>
  </v-container>
</template>
<script>
export default {
  name: 'ApplicationAging',
  props: {
    value: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: () => ({
  }),
  computed: {
    age: {
      get () {
        return this.value * 4
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  },
  methods: {
    displayValue (value) {
      const display = value / 4
      return display
    }
  }
}
</script>
