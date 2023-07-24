<script>

import VueCharts, { mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

export default {
  extends: VueCharts.Pie,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.renderChart(this.chartData,
      {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          position: 'right',
          display: true,
          align: 'center',
          maxWidth: 1,
          labels: {
            boxWidth: 10
          }
        },
        animation: {
          duration: 0
        }
      })
  }
}
</script>
