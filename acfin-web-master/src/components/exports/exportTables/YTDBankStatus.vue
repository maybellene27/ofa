<template>
  <div>
    <table
      id="YTDBankStatus"
      border="1"
    >
      <tr>
        <th>{{ companyName }}</th>
      </tr>
      <tr>
        <th>Retail Financing Applications Monitoring</th>
      </tr>
      <tr>
        <th>YTD {{ yearStr }}</th>
      </tr>
      <tr>
        <th>{{ bankName }}</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ month }}
        </th>
      </tr>
      <tr
        v-for="(status, i) in displayPerCriteria(appStatuses)"
        :key="i"
      >
        <th>{{ appStatuses[status] }}</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ totalStatus(status, (key + 1)) }}
        </th>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ grandTotal((key + 1)) }}
        </th>
      </tr>
    </table>
    <br>
    <table
      border="1"
    >
      <tr>
        <th>{{ bankName }}</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ month }}
        </th>
      </tr>
      <tr
        v-for="(status, i) in displayPerCriteria(appStatuses)"
        :key="i"
      >
        <th>{{ appStatuses[status] }}</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ `${totalPercent(status, (key + 1))}%` }}
        </th>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th
          v-for="(month, key) in monthList"
          :key="key"
        >
          {{ `${grandTotalPercent((key + 1))}%` }}
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'YTDBankStatus',
  props: {
    tableContent: {
      type: Object,
      default: () => {}
    },
    bank: {
      type: String,
      default: ''
    },
    bankList: {
      type: Array,
      default: () => {}
    }
  },
  computed: {
    ...mapFields('masterData', {
      banks: 'financingPartner'
    }),
    contentData () {
      return this.tableContent
    },
    companyName () {
      return this.contentData && this.contentData.companyName
    },
    bankName () {
      return this.bank && this.banks.filter(bank => bank._id === this.bank)[0].name
    },
    yearStr () {
      return this.contentData && this.contentData.year
    },
    monthList () {
      return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    },
    appStatuses () {
      return {
        approved: 'APPROVED',
        declined: 'DECLINED',
        withAddtlBankRequirements: 'W/ ADDTL BANK REQUIREMENTS',
        noStatusYet: 'NO STATUS YET',
        notSentToThisBank: 'NOT SENT TO THIS BANK'
      }
    }
  },
  methods: {
    displayPerCriteria (obj) {
      return Object.getOwnPropertyNames(obj)
    },
    totalStatus (status, month) {
      const statusVal = this.contentData[`${status}`] || []
      let total = 0
      statusVal.map(val => {
        if (val.submittedMonth === month) {
          total = val.totalApplications
        }
      })
      return total || 0
    },
    totalPercent (status, month) {
      if (status !== 'notSentToThisBank') {
        const statusVal = this.contentData[`${status}`] || []
        const totals = this.contentData.grandTotal || []
        let total = 0
        statusVal.map(val => {
          const { totalApplications } = totals.filter(total => total.submittedMonth === val.submittedMonth)[0]
          if (val.submittedMonth === month) {
            total = (val.totalApplications / totalApplications) * 100
          }
        })
        return total.toFixed(1)
      }
      return 0
    },
    grandTotal (month) {
      const totals = this.contentData.grandTotal || []
      let tots = 0
      totals.map(total => {
        if (total.submittedMonth === month) {
          tots = total.totalApplications
        }
      })
      return tots
    },
    grandTotalPercent (month) {
      const totals = this.contentData.grandTotal || []
      let tots = 0
      totals.map(total => {
        if (total.submittedMonth === month) {
          tots = total.totalApplications && total.totalApplications !== 0 ? 100 : 0
        }
      })
      return tots
    }
  }
}
</script>
