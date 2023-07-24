<template>
  <v-col>
    <v-card
      class="ma-5"
    >
      <v-system-bar
        color="light-blue darken-4"
        lights-out
        dark
        height="50"
        class="pa-5"
      >
        <h3> Add Vehicle </h3>
      </v-system-bar>
      <div
        class="pa-5"
      >
        <div class="pb-3">
          <b>Enter Details</b>
        </div>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-select
              id="brand"
              v-model="brand"
              class="required-field"
              :items="filteredBrands"
              label="Brand"
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('brand','Brand')"
              @input="$v.brand.$touch()"
              @blur="$v.brand.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="model"
              v-model="model"
              class="required-field"
              label="Model"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('model', 'Model')"
              @input="$v.model.$touch()"
              @blur="$v.model.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="variant"
              v-model="variant"
              class="required-field"
              label="Variant"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('variant', 'Variant')"
              @input="$v.variant.$touch()"
              @blur="$v.variant.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <DateComponent
              id="year"
              key="year"
              v-model="year"
              date-class="required-field"
              label="Year"
              :outlined="editable"
              :disabled="!editable"
              placeholder="YYYY"
              is-dense
              no-title
              :value="year"
              :exact-length="4"
              :error-messages="genericError('year', 'Year')"
              @input="() => {
                $v.year.$touch()
              }"
              @blur="() => {
                $v.year.$touch()
              }"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
        >
          <v-col cols="12">
            <v-text-field
              id="price"
              v-model="price"
              class="required-field"
              type="text"
              label="SRP"
              dense
              :outlined="editable"
              :disabled="!editable"
              :error-messages="genericError('price', 'SRP')"
              @input="$v.price.$touch()"
              @blur="$v.price.$touch()"
            />
          </v-col>
        </v-row>
        <FreightForm
          ref="freightForm"
          :editable="editable"
          :operation="operation"
        />
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'
import FreightForm from './FreightForm'
import DateComponent from '@/components/fields/DateComponent'
import { convertToCurrency } from '@/utils/helpers'
import user from '@/utils/webapi/users'

export default {
  components: {
    FreightForm,
    DateComponent
  },
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean,
    crudFormMethods: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    currentUser: undefined
  }),
  computed: {
    ...validationErrors,
    ...mapFields('vehicle', {
      brand: 'brand',
      model: 'model',
      variant: 'variant',
      year: 'year',
      price: 'price',
      freights: 'freights'
    }),
    brands () {
      return [
        'Honda',
        'Isuzu',
        'KIA',
        'KTM',
        'Maxus',
        'Volkswagen'
      ]
    },
    filteredBrands () {
      let brands = []
      if (this.$s.userRole && this.$s.userRole.includes('systemAdmin')) {
        brands = this.brands.filter((x) => {
          if (this.currentUser && this.currentUser.brand.length && this.currentUser.brand.includes(x)) {
            return x
          }
        })
      } else {
        brands = this.brands
      }
      return brands
    }
  },
  watch: {
    price: {
      handler (obj) {
        this.amountExchange(obj, 'price')
      }
    }
  },
  async created () {
    await this.getUser()
  },
  methods: {
    async getUser () {
      const resp = await user.getUser(this.$s.userRole && this.$s.userRole.toString(), this.$s.user)
      const data = await resp.json()
      this.currentUser = data.entry
    },
    amountExchange (val, key) {
      this[key] = convertToCurrency(val)
    }
  },
  validations () {
    return custom.vehicle
  }
}
</script>
