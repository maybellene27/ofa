<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        md="6"
        sm="6"
      >
        <v-text-field
          :id="`${firstLayerObj}AddressStreet`"
          v-model="address.street"
          class="black--text required-field"
          label="Bldg. No/ House No./ Street"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('address.street','Street')"
          @input="$v.address.street.$touch()"
          @blur="$v.address.street.$touch()"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <LookUpSelect
          :id="`${firstLayerObj}AddressRegion`"
          v-model.trim="address.region"
          text-field-class="black--text"
          label="Region"
          item-text="name"
          item-value="_id"
          name="region"
          :query="{ type: 'region' }"
          :can-edit="editable"
          @input="() => {
            changeRegion()
          }"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <LookUpSelect
          :id="`${firstLayerObj}AddressProvince`"
          v-model="address.province"
          text-field-class="black--text required-field"
          label="Province"
          name="province"
          :query="{ type: 'province', jurisdiction: address.region }"
          :can-edit="editable"
          :error-messages="genericError('address.province','Province')"
          @input="() => {
            $v.address.province.$touch()
            changeProvince()
          }"
          @blur="$v.address.province.$touch()"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <LookUpSelect
          :id="`${firstLayerObj}AddressCity`"
          v-model="address.city"
          text-field-class="black--text required-field"
          label="City"
          name="city"
          :query="{ type: 'town', jurisdiction: address.province }"
          :can-edit="editable"
          :error-messages="genericError('address.city','City')"
          @input="() => {
            $v.address.city.$touch()
            changeCity()
          }"
          @blur="$v.address.city.$touch()"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <LookUpSelect
          :id="`${firstLayerObj}AddressBarangay`"
          v-model="address.barangay"
          text-field-class="black--text"
          label="Barangay"
          name="barangay"
          :query="{ type: 'barangay', jurisdiction: address.city }"
          :can-edit="editable"
        />
      </v-col>
      <slot name="addCol" />
    </v-row>
  </v-container>
</template>

<script>
import { LookUpSelect } from 'maroon-vue-components'
import { validationMixin, custom, validationErrors } from '@/utils/validations'
export default {
  components: {
    LookUpSelect
  },
  mixins: [validationMixin],
  props: {
    firstLayerObj: {
      type: String,
      default: 'presentAddress'
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...validationErrors,
    address: {
      get () {
        return this.$store.getters['application/getCustomObject'](this.firstLayerObj)
      },
      set (value) {
        this.$store.dispatch('application/setCustomObject', value, this.firstLayerObj)
      }
    }
  },
  methods: {
    changeRegion () {
      this.address.province = ''
      this.address.city = ''
      this.address.barangay = ''
    },
    changeProvince () {
      this.address.city = ''
      this.address.barangay = ''
    },
    changeCity () {
      this.address.barangay = ''
    }
  },
  validations () {
    return { address: custom.address }
  }
}
</script>
