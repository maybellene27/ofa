<template>
  <v-autocomplete
    v-model="selectedItems"
    class="black--text required-field field"
    :label="label"
    :items="items"
    :item-text="itemText"
    :item-value="itemValue"
    multiple
    small-chips
    :loading="loading"
    deletable-chips
    :outlined="editable"
    :readonly="!editable"
    :error-messages="errorMessages"
  >
    <template v-slot:prepend-item>
      <v-list-item
        ripple
        @click="selectAllItems"
      >
        <v-list-item-action>
          <v-icon
            :color="selectedItems && selectedItems.length > 0 ? 'blue darken-4' : ''"
          >
            {{ selectAllIcon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            Select All
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
    <template v-slot:selection="{ index, item }">
      <v-chip
        close
        color="primary"
        @click:close="() => {
          selectedItems.splice(index, 1)
        }"
      >
        {{ item.name || item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: 'SelectAll',
  props: {
    value: {
      type: Array,
      default: () => {}
    },
    items: {
      type: Array,
      default: () => {}
    },
    errorMessages: {
      type: Array,
      default: () => {}
    },
    label: {
      type: String,
      default: 'Select All'
    },
    editable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    }
  },
  computed: {
    selectedItems: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    },
    allItemsSelected () {
      return this.selectedItems && this.selectedItems.length === this.items.length
    },
    someItemsSelected () {
      return this.selectedItems && this.selectedItems.length > 0 && !this.allItemsSelected
    },
    selectAllIcon () {
      if (this.allItemsSelected) return 'mdi-close-box'
      if (this.someItemsSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  methods: {
    selectAllItems () {
      if (this.allItemsSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = this.items.map((x) => {
          if (x._id) {
            return x._id
          }
          return x
        })
      }
    }
  }
}
</script>
<style scoped>
.field >>> .v-select__selections {
  min-height: 26px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
