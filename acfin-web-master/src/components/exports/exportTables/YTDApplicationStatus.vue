<template>
  <div>
    <table
      id="YTDApplicationStatus"
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
        <th>YTD APPLICATION STATUS</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ bank.name }}
        </th>
      </tr>
      <tr
        v-for="(status, i) in displayPerCriteria(appStatuses)"
        :key="i"
      >
        <th>{{ appStatuses[status] }}</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ totalStatus(status, bank.name) }}
        </th>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ grandTotal(bank.name) }}
        </th>
      </tr>
    </table>
    <br>
    <table
      border="1"
    >
      <tr>
        <th>YTD APPLICATION STATUS</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ bank.name }}
        </th>
      </tr>
      <tr
        v-for="(status, i) in displayPerCriteria(appStatuses)"
        :key="i"
      >
        <th>{{ appStatuses[status] }}</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ `${totalPercent(status, bank.name)}%` }}
        </th>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th
          v-for="(bank, key) in bankList"
          :key="key"
        >
          {{ `${grandTotalPercent(bank.name)}%` }}
        </th>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'YTDApplicationStatus',
  props: {
    tableContent: {
      type: Object,
      default: () => {}
    },
    bankList: {
      type: Array,
      default: () => {}
    }
  },
  computed: {
    contentData () {
      return this.tableContent
    },
    companyName () {
      return this.contentData && this.contentData.companyName
    },
    yearStr () {
      return this.contentData && this.contentData.year
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
    totalStatus (status, bank) {
      const statusVal = this.contentData[`${status}`] || []
      let total = 0
      statusVal.map(val => {
        if (val.bank === bank) {
          total = val.totalApplications
        }
      })
      return total
    },
    totalPercent (status, bank) {
      if (status !== 'notSentToThisBank') {
        const statusVal = this.contentData[`${status}`] || []
        const totals = this.contentData.grandTotal || []
        let total = 0
        statusVal.map(val => {
          const { totalApplications } = totals.filter(total => total.bank === val.bank)[0]
          if (val.bank === bank) {
            total = (val.totalApplications / totalApplications) * 100
          }
        })
        return total.toFixed(1)
      }
      return 0
    },
    grandTotal (bank) {
      const totals = this.contentData.grandTotal || []
      let tots = 0
      totals.map(total => {
        if (total.bank === bank) {
          tots = total.totalApplications
        }
      })
      return tots
    },
    grandTotalPercent (bank) {
      const totals = this.contentData.grandTotal || []
      let tots = 0
      totals.map(total => {
        if (total.bank === bank) {
          tots = total.totalApplications && total.totalApplications !== 0 ? 100 : 0
        }
      })
      return tots
    }
  }
}
</script>
