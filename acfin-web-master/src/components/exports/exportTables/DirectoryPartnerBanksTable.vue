<template>
  <v-row>
    <table
      id="directoryPartnerBank"
      border="1"
    >
      <tr>
        <td>
          {{ (data.branch && data.branch.name) || data.brand }}
        </td>
      </tr>
      <tr>
        <td>
          Retail Financing Applications Monitoring
        </td>
      </tr>
      <tr>
        <td>
          Bank Directory
        </td>
      </tr>
      <tr>
        <td>
          As of `{{ toLongDate(data.dateExported) }}
        </td>
      </tr>
      <thead>
        <tr>
          <td rowspan="2">
            Bank
          </td>
          <td
            colspan="2"
            style="text-align: center"
          >
            &nbsp;&nbsp;&nbsp;&nbsp; Name of Contact Person
          </td>
          <td
            colspan="4"
            style="text-align: center"
          >
            Contact Details
          </td>
        </tr>
        <tr>
          <td>
            Position
          </td>
          <td>
            Name
          </td>
          <td>
            Landline #
          </td>
          <td>
            Fax #
          </td>
          <td>
            CP #
          </td>
          <td>
            Email Address
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(content, index) in data.banks"
          :key="index"
        >
          <td>
            {{ content.name }}
          </td>
          <td>
            {{ content.designation }}
          </td>
          <td>
            {{ content.contactPerson }}
          </td>
          <td>
            {{ content.contactNo && `"${content.contactNo}"` }}
          </td>
          <td>
            {{ content.fax }}
          </td>
          <td>
            <template
              v-if="content.mobileNo && content.mobileNo.length"
            >
              <div
                v-for="(mobile, i) in content.mobileNo"
                :key="i"
              >
                {{ mobile && `"${mobile}", ` }}
              </div>
            </template>
          </td>
          <td>
            {{ content.email }}
          </td>
        </tr>
      </tbody>
    </table>
  </v-row>
</template>
<script>
import { toDateString } from '@/utils/helpers'
export default {
  name: 'DirectoryPartnerBanksTable',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    user: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    brandData: ''
  }),
  methods: {
    toLongDate (date) {
      return toDateString(date)
    }
  }
}
</script>
