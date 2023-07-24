import { html2Pdf } from '../utils/helpers'

const exportPDFMixin = {
  methods: {
    savePDF (element, report) {
      const options = this.getOptions(report)
      html2Pdf(element, options, report)
    },
    getOptions (report) {
      const options = {
        margin: [72, 72, 72, 72],
        filename: 'Generated.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        pagebreak: { mode: ['avoid-all', 'css'] },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      }
      switch (report) {
        case 'application':
          options.margin = [10, 10, 20, 20]
          options.pagebreak = { mode: ['css', 'legacy'] }
          options.jsPDF = { unit: 'pt', format: 'a4', orientation: 'portrait' }
          break
        case 'piegraph':
          options.margin = [20, 20, 20, 20]
          options.pagebreak = { mode: ['css', 'legacy'] }
          options.jsPDF = { unit: 'pt', format: 'a4', orientation: 'portrait' }
          break
      }
      return options
    }
  }

}
export default exportPDFMixin
