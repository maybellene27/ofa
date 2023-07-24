import { getField, updateField } from 'vuex-map-fields'
const getDefaultState = () => {
  return {
    typeOfSeparation: undefined,
    dateSubmitted: undefined,
    recommendDate: undefined,
    selectedBankName: undefined,
    bankReturnReason: undefined,
    unreleasedDate: undefined,
    dateReleased: undefined,
    consentClause: undefined,
    approvalAge: undefined,
    recommendAge: undefined,
    releaseAge: undefined,
    declineReason: undefined,
    bankTransferRemarks: undefined,
    bank: undefined,
    bankStatus: undefined,
    bankName: undefined,
    status: 'draft',
    user: undefined,
    age: undefined,
    birthday: undefined,
    tin: undefined,
    maritalStatus: undefined,
    citizenship: undefined,
    returnReason: undefined,
    bankApplication: undefined,
    presentAddress: {
      street: undefined,
      barangay: undefined,
      region: undefined,
      province: undefined,
      city: undefined,
      lengthOfStay: undefined,
      ownership: undefined,
      noOfDependents: undefined
    },
    previousAddress: {
      street: undefined,
      barangay: undefined,
      region: undefined,
      province: undefined,
      city: undefined,
      lengthOfStay: undefined,
      ownership: undefined
    },
    spouse: [{
      firstName: undefined,
      middleName: undefined,
      lastName: undefined,
      age: undefined,
      birthday: undefined,
      tin: undefined,
      telephone: undefined,
      mobile: undefined,
      email: undefined
    }],
    applicantEmployment: {
      type: undefined,
      name: undefined,
      address: undefined,
      position: undefined,
      telephone: undefined,
      years: undefined,
      monthlyIncome: undefined,
      otherSourceOfIncome: undefined
    },
    spouseEmployment: [{
      type: undefined,
      name: undefined,
      address: undefined,
      position: undefined,
      telephone: undefined,
      years: undefined,
      monthlyIncome: undefined,
      otherSourceOfIncome: undefined,
      relationship: undefined
    }],
    vehiclePurchased: {
      branch: undefined,
      brand: undefined,
      model: undefined,
      variant: undefined,
      bodyConversion: undefined,
      year: undefined,
      sellingPrice: undefined,
      amountFinance: undefined,
      downpayment: undefined,
      term: undefined,
      salesExecutive: undefined,
      validID: null,
      type: undefined,
      local: {
        coe: {
          required: false,
          attachment: null
        },
        payslip: {
          required: false,
          attachment: null
        },
        itr: {
          required: false,
          attachment: null
        }
      },
      ofwLandBased: {
        coe: {
          required: false,
          attachment: null
        },
        payslip: {
          required: false,
          attachment: null
        },
        remittance: {
          required: false,
          attachment: null
        }
      },
      ofwSeaBased: {
        coe: {
          required: false,
          attachment: null
        },
        payslip: {
          required: false,
          attachment: null
        },
        allotment: {
          required: false,
          attachment: null
        },
        tip: {
          required: false,
          attachment: null
        },
        voucher: {
          required: false,
          attachment: null
        }
      },
      banks: undefined,
      borrowerSignature: null,
      spouseSignature: null,
      date: undefined
    },
    monthInvoice: undefined,
    monthSubmitted: undefined,
    cancelRemarks: undefined,
    selectedBank: undefined,
    cancellationLetter: undefined
  }
}

const state = getDefaultState()

const mutations = {
  updateField,
  set (state, payload) {
    for (const key in payload) {
      if (Array.isArray(payload[key])) {
        Object.prototype.hasOwnProperty.call(state, key) && (state[key] = payload[key])
      } else {
        if (typeof payload[key] === 'object') {
          const nestedState = state[key]
          for (const nestedKey in payload[key]) {
            Object.prototype.hasOwnProperty.call(nestedState, nestedKey) && (nestedState[nestedKey] = payload[key][nestedKey])
          }
        } else {
          Object.prototype.hasOwnProperty.call(state, key) && (state[key] = payload[key])
        }
      }
    }
  },
  reset (state) {
    Object.assign(state, getDefaultState())
  },
  customObjectReset (state, type) {
    const objDefaultState = getDefaultState()[type]
    Object.assign(state[type], objDefaultState)
  }
}

const getters = {
  getField,
  getCustomObject: (state) => (type) => {
    return state[type]
  }
}

const actions = {
  async set ({ commit }, payload) {
    commit('set', payload)
  },
  async reset ({ commit }) {
    commit('reset')
  },
  async setCustomObject ({ commit }, payload, type) {
    commit('set', payload[type])
  },
  async resetCustomObject ({ commit }, type) {
    commit('customObjectReset', type)
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true
}
