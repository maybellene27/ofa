<template>
  <v-row>
    <table
      id="invoiceRetailBanksTable"
      border="1"
    >
      <thead>
        <tr>
          <td rowspan="2">
            &nbsp;
          </td>
          <td
            rowspan="2"
            style="text-align: center"
          >
            TOTAL APPLICATION
          </td>
          <td
            rowspan="2"
            style="text-align: center"
          >
            APPROVED APPLICATION
          </td>
          <td
            rowspan="2"
            style="text-align: center"
          >
            APPROVAL RATIO
          </td>
          <td
            :colspan="banks && banks.length"
            style="text-align: center"
          >
            BANK
          </td>
          <td
            rowspan="2"
            style="text-align: center"
          >
            TOTAL INVOICED
          </td>
        </tr>
        <tr>
          <td
            v-for="(bank, index) in banks"
            :key="index"
          >
            {{ bank.name }}
          </td>
        </tr>
      </thead>
      <tr>
        <td>
          {{ previousYear }} APPLICATIONS
        </td>
        <td>
          &nbsp;
        </td>
        <td>
          &nbsp;
        </td>
        <td>
          &nbsp;
        </td>
        <td
          v-for="(mInvoiced, mIndex) in totalPreviousApplicationMonthly"
          :key="mIndex"
        >
          {{ mInvoiced.totalInvoiced }}
        </td>
        <td>
          {{ previousApplicationGrandTotal }}
        </td>
      </tr>
      <tr
        v-for="(invoice, idx) in previousApplicationMapping"
        :key="`${idx}${invoice}`"
      >
        <td>
          {{ invoice.name }}
        </td>
        <td>
          &nbsp;
        </td>
        <td>
          &nbsp;
        </td>
        <td>
          &nbsp;
        </td>
        <td
          v-for="(pInvoiced, pI) in invoice.invoicedApplications"
          :key="pI"
        >
          {{ pInvoiced.totalInvoiced }}
        </td>
        <td>
          {{ invoice.grandTotalInvoiced }}
        </td>
      </tr>
      <tbody
        v-for="(content, i) in dataMapping"
        :key="i"
      >
        <tr>
          <td>
            {{ content.month }}
          </td>
          <td>
            {{ content.monthlyTotalApplication }}
          </td>
          <td>
            {{ content.totalApproved }}
          </td>
          <td>
            {{ `${content.totalApprovalRatioMonthly}%` }}
          </td>
          <td
            v-for="(mInvoiced, idx) in content.totalInvoiced"
            :key="idx"
          >
            {{ mInvoiced.totalInvoiced }}
          </td>
        </tr>
        <tr
          v-for="(invoice, count) in content.invoices"
          :key="count"
        >
          <td>
            {{ invoice.name }}
          </td>
          <td>
            {{ invoice.totalSubmittedApplication }}
          </td>
          <td>
            {{ invoice.approvedApplication }}
          </td>
          <td>
            {{ `${invoice.approvalRatio}%` }}
          </td>
          <td
            v-for="(invoiced, key) in invoice.invoicedApplications"
            :key="key"
          >
            {{ invoiced.totalInvoiced }}
          </td>
          <td>
            {{ invoice.grandTotalInvoiced }}
          </td>
        </tr>
      </tbody>
      <tr>
        <td>
          TOTAL
        </td>
        <td>
          {{ yearlyTotalApplication }}
        </td>
        <td>
          {{ yearlyTotalApproved }}
        </td>
        <td>
          {{ `${yearlyApprovalRatio}%` }}
        </td>
        <td
          v-for="(total, tIndex) in yearTotalInvoiced"
          :key="tIndex"
        >
          {{ total.totalInvoiced }}
        </td>
        <td>
          {{ yearGrandTotalInvoice }}
        </td>
      </tr>
    </table>
  </v-row>
</template>
<script>
export default {
  name: 'InvoiceRetailBanksTable',
  props: {
    data: {
      type: Array,
      default: () => {}
    },
    banks: {
      type: Array,
      default: () => {}
    }
  },
  data: () => ({
    totalInvoice: 0
  }),
  computed: {
    previousYear () {
      return this.data && this.data.length && this.data[0].previousYear
    },
    currentYear () {
      return this.data && this.data.length && this.data[0].currentYear
    },
    monthList () {
      return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    },
    yearlyApprovalRatio () {
      const ratio = this.invoicePercentage(this.yearlyTotalApplication, this.yearlyTotalApproved)
      return ratio
    },
    yearlyTotalApplication () {
      let total = 0
      total = this.dataMapping.reduce((initial, current) => {
        return current.monthlyTotalApplication + initial
      }, 0)
      return total
    },
    yearlyTotalApproved () {
      let total = 0
      total = this.dataMapping.reduce((initial, current) => {
        return current.totalApproved + initial
      }, 0)
      return total
    },
    yearGrandTotalInvoice () {
      let total = 0
      total = this.dataMapping.reduce((initial, current) => {
        return current.grandTotalInvoicedMonthly + initial
      }, 0)
      return total
    },
    yearTotalInvoiced () {
      const initialInvoiced = this.banks.map((bank) => {
        return {
          bank: bank._id,
          totalInvoiced: 0
        }
      })
      const total = this.dataMapping.reduce((initial, current) => {
        const arrayOfInvoiced = current.totalInvoiced
        arrayOfInvoiced.forEach((invoice, idx) => {
          const num = invoice.totalInvoiced || 0
          initial[idx].totalInvoiced += num
        })
        return initial
      }, initialInvoiced)
      return total
    },
    combinedTotalInvoice () {
      const concat = [
        {
          totalInvoiced: this.totalPreviousApplicationMonthly
        },
        {
          totalInvoiced: this.yearTotalInvoiced
        }
      ]
      const initialInvoiced = this.banks.map((bank) => {
        return {
          bank: bank._id,
          totalInvoiced: 0
        }
      })
      const totalInvoiced = concat.reduce((initial, current) => {
        const arrayOfInvoiced = current.totalInvoiced
        arrayOfInvoiced.forEach((app, idx) => {
          const num = app.totalInvoiced || 0
          initial[idx].totalInvoiced += num
        })
        return initial
      }, initialInvoiced)
      return totalInvoiced
    },
    combinedGrandTotalInvoice () {
      const total = this.previousApplicationGrandTotal + this.yearGrandTotalInvoice
      return total
    },
    previousApplicationGrandTotal () {
      const grandTotalInvoicedMonthly = this.totalPreviousApplicationMonthly.reduce((initial, current) => {
        return current.totalInvoiced + initial
      }, 0)
      return grandTotalInvoicedMonthly
    },
    totalPreviousApplicationMonthly () {
      const initialInvoiced = this.banks.map((bank) => {
        return {
          bank: bank._id,
          totalInvoiced: 0
        }
      })
      const totalInvoiced = this.previousApplicationMapping.reduce((initial, current) => {
        const arrayOfInvoiced = current.invoicedApplications
        arrayOfInvoiced.forEach((app, idx) => {
          const num = app.totalInvoiced || 0
          initial[idx].totalInvoiced += num
        })
        return initial
      }, initialInvoiced)
      return totalInvoiced
    },
    previousApplicationMapping () {
      const invoices = this.data.map((invoice) => {
        const submittedApplication = invoice.previousTotalInvoiced.find((submitted) => {
          if (submitted.yearSubmitted === this.previousYear) {
            return submitted
          }
        })
        const invoicedApplications = this.banks.map((bankInvoice, invoicedIndex) => {
          const invoiced = submittedApplication && submittedApplication.applications.find((invoiced) => {
            if (invoiced.bank === bankInvoice._id) {
              return invoiced
            }
          })
          const newData = {
            bank: bankInvoice._id,
            totalInvoiced: invoiced && invoiced.totalInvoiced
          }
          return newData
        })
        const grandTotalInvoiced = invoicedApplications.reduce((initial, current) => {
          const total = current && current.totalInvoiced ? current.totalInvoiced : 0
          return total + initial
        }, 0)
        return {
          name: invoice.filter,
          invoicedApplications,
          submittedApplication,
          grandTotalInvoiced
        }
      })
      return invoices
    },
    dataMapping () {
      const mappedData = this.monthList.map((month, index) => {
        const invoices = this.data.map((invoice) => {
          const totalSubmittedApplication = invoice.totalApplication.find((submitted) => {
            if (submitted.monthSubmitted === (index + 1) && submitted.yearSubmitted === this.currentYear) {
              return submitted
            }
          })
          const approvedApplication = invoice.totalApproved.find((approved) => {
            if (approved.monthApproved === (index + 1) && approved.yearApproved === this.currentYear) {
              return approved
            }
          })
          const submittedApplication = invoice.totalInvoiced.find((submitted) => {
            if (submitted.monthSubmitted === (index + 1) && submitted.yearSubmitted === this.currentYear) {
              return submitted
            }
          })
          const invoicedApplications = this.banks.map((bankInvoice, invoicedIndex) => {
            const invoiced = submittedApplication && submittedApplication.applications.find((invoiced) => {
              if (invoiced.bank === bankInvoice._id) {
                return invoiced
              }
            })
            const newData = {
              bank: bankInvoice._id,
              totalInvoiced: invoiced && invoiced.totalInvoiced
            }
            return newData
          })
          const grandTotalInvoiced = invoicedApplications.reduce((initial, current) => {
            const total = current && current.totalInvoiced ? current.totalInvoiced : 0
            return total + initial
          }, 0)
          const approvalRatio = this.invoicePercentage(totalSubmittedApplication && totalSubmittedApplication.totalApplication, approvedApplication && approvedApplication.totalApproved)
          return {
            name: invoice.filter,
            approvedApplication: approvedApplication && approvedApplication.totalApproved,
            invoicedApplications,
            grandTotalInvoiced,
            totalSubmittedApplication: totalSubmittedApplication && totalSubmittedApplication.totalApplication,
            approvalRatio
          }
        })
        const totalApproved = invoices.reduce((initial, current) => {
          const totalApproved = current.approvedApplication || 0
          return totalApproved + initial
        }, 0)
        const monthlyTotalApplication = invoices.reduce((initial, current) => {
          const totalApplication = current.totalSubmittedApplication || 0
          return totalApplication + initial
        }, 0)
        const initialInvoiced = this.banks.map((bank) => {
          return {
            bank: bank._id,
            totalInvoiced: 0
          }
        })
        const totalInvoiced = invoices.reduce((initial, current) => {
          const arrayOfInvoiced = current.invoicedApplications
          arrayOfInvoiced.forEach((app, idx) => {
            const num = app.totalInvoiced || 0
            initial[idx].totalInvoiced += num
          })
          return initial
        }, initialInvoiced)
        const grandTotalInvoicedMonthly = totalInvoiced.reduce((initial, current) => {
          return current.totalInvoiced + initial
        }, 0)
        const totalApprovalRatioMonthly = this.invoicePercentage(monthlyTotalApplication, totalApproved)
        return {
          month: `${this.currentYear} ${index + 1} ${month} APPLICATIONS`,
          invoices,
          totalApproved,
          totalInvoiced,
          grandTotalInvoicedMonthly,
          monthlyTotalApplication,
          totalApprovalRatioMonthly
        }
      })
      return mappedData
    }
  },
  methods: {
    invoicePercentage (totalApproved, totalInvoice) {
      let ave = 0
      if (totalApproved && totalInvoice) {
        ave = (totalInvoice / totalApproved) * 100
      }
      return ave.toFixed(2)
    }
  }
}
</script>
