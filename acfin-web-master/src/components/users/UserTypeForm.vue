<template>
  <v-col>
    <v-card class="pa-5">
      <v-row>
        <v-col cols="12">
          <LookUpSelect
            v-model.trim="userRole"
            label="User Role"
            name="userRole"
            text-field-class="black--text required-field"
            is-dense
            :clearable="false"
            item-text="_configType"
            item-value="_configType"
            :query="{ _configType: { $nin: ['guest', 'default'] } }"
            :outlined="editable"
            :can-edit="editable"
            :error-messages="genericError('userRole', 'User role')"
            @input="$v.userRole.$touch()"
            @blur="$v.userRole.$touch()"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { LookUpSelect } from 'maroon-vue-components'
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'

export default {
  components: {
    LookUpSelect
  },
  mixins: [validationMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  computed: {
    ...validationErrors,
    ...mapFields('users', {
      userRole: 'info.userRole',
      userType: 'info.userType'
    })
  },
  validations () {
    const {
      userType,
      userRole
    } = custom.users

    return {
      userType,
      userRole
    }
  }
}
</script>
