<template>
  <v-container>
    <div class="pb-3">
      <b>Employment</b>
    </div>
    <v-row>
      <v-col>
        <EmploymentComponent
          ref="applicantEmploymentRef"
          title="Applicant"
          type="applicantEmployment"
          :operation="operation"
          :editable="editable"
          :field-required="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <EmploymentComponentArray
          ref="spouseEmploymentRef"
          title="Spouse / Co-Maker"
          type="spouseEmployment"
          :operation="operation"
          :editable="editable"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EmploymentComponent from '@/components/applications/EmploymentComponent'
import EmploymentComponentArray from '@/components/applications/EmploymentComponentArray'

export default {
  name: 'EmploymentForm',
  components: {
    EmploymentComponent,
    EmploymentComponentArray
  },
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  }
}
</script>
