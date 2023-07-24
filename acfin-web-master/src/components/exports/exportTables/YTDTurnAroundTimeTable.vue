<template>
  <table
    id="YTDTurnAroundTime"
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
      <th>TURN-AROUND TIME</th>
      <th
        v-for="(month, key) in monthList"
        :key="key"
      >
        {{ month }}
      </th>
    </tr>
    <tr
      v-for="(item, i) in banks"
      :key="i"
    >
      <th>{{ item.name }}</th>
      <th
        v-for="(month, key) in monthList"
        :key="key"
      >
        {{ turnAround(item.name, key + 1) }}
      </th>
    </tr>
  </table>
</template>

<script>

export default {
  name: 'YTDTurnAroundTime',
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
    companyName () {
      return this.tableContent && this.tableContent.company
    },
    yearStr () {
      return this.tableContent && this.tableContent.year
    },
    turnaroundTime () {
      return this.tableContent && this.tableContent.turnaroundTime
    },
    monthList () {
      return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    },
    banks () {
      return this.bankList
    }
  },
  methods: {
    turnAround (bank, monthIndex) {
      let avgTat = '-'
      const turnAround = this.turnaroundTime || []
      turnAround.map(data => {
        const ticket = data._id
        if (ticket.bank === bank && ticket.recommendedMonth === monthIndex) {
          const avgTime = String(data.averageTurnaroundTime)
          avgTat = avgTime === 'null' ? '-' : avgTime
        }
      })
      return avgTat
    }
  }
}
</script>
