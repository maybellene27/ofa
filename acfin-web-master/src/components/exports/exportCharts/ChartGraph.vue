<template>
  <v-container>
    <div
      class="ma-0 pa-0"
    >
      <p>
        {{ `${year} Conso Retail Financing per Bank` }}
      </p>
      <conso-pie-graph
        style="width: 700px; height: 700px;"
        :chart-data="topFour"
      />
    </div>
    <div
      class="ma-0 pa-0"
      style="page-break-inside: avoid"
    >
      <p>
        * Other Banks
      </p>
      <conso-pie-graph
        style="width: 650px; height: 650px;"
        :chart-data="others"
      />
    </div>
  </v-container>
</template>

<script>

import ConsoPieGraph from './ConsoPieGraph'

export default {
  name: 'Chart',
  components: {
    ConsoPieGraph
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    colors () {
      return [
        '#03a9f4',
        '#00bcd4',
        '#e91e63',
        '#d99a57',
        '#d16619',
        '#ea7a2f',
        '#93c1cf',
        '#c7dbeb',
        '#a6a69f',
        '#d993ad'
      ]
    },
    otherColors () {
      return [
        '#ea7a2f',
        '#93c1cf',
        '#c7dbeb',
        '#a6a69f',
        '#d993ad',
        '#03a9f4',
        '#00bcd4',
        '#e91e63',
        '#d99a57',
        '#d16619'
      ]
    },
    year () {
      return this.data && this.data.year
    },
    topFourDatasets () {
      const newData = this.data && this.data.topFour && this.data.topFour.map((info) => {
        if (info.percent !== 0) {
          return info.percent
        }
      })
      return newData
    },
    topFourLabels () {
      const newData = this.data && this.data.topFour && this.data.topFour.map((info) => {
        const round = info.percent.toFixed(2)
        return info._id && `${info._id.bank} (${round}%)`
      })
      return newData
    },
    otherDatasets () {
      const newData = this.data && this.data.others && this.data.others.map((info) => {
        if (info.percent !== 0) {
          return info.percent
        }
      })
      return newData
    },
    otherLabels () {
      const newData = this.data && this.data.others && this.data.others.map((info) => {
        const round = info.percent.toFixed(2)
        return info._id && `${info._id.bank} (${round}%)`
      })
      return newData
    },
    topFour () {
      return {
        labels: this.topFourLabels,
        datasets: [
          {
            backgroundColor: this.colors,
            data: this.topFourDatasets
          }
        ]
      }
    },
    others () {
      return {
        labels: this.otherLabels,
        datasets: [
          {
            backgroundColor: this.otherColors,
            data: this.otherDatasets
          }
        ]
      }
    }
  }
}
</script>
