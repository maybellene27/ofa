import { getField, updateField } from 'vuex-map-fields'
const getDefaultState = () => {
  return {
    info: {
      _status: undefined,
      firstName: undefined,
      middleName: undefined,
      lastName: undefined,
      email: undefined,
      mobile: undefined,
      telephone: undefined,
      createdBy: undefined,
      updatedBy: undefined,
      dateCreated: undefined,
      dateUpdated: undefined,
      status: undefined,
      userRole: undefined,
      userType: 'Internal',
      multipleBranch: undefined,
      singleBranch: undefined,
      brand: undefined,
      password: undefined,
      confirmPassword: undefined,
      reason: undefined,
      bank: undefined,
      superUserBank: undefined
    },
    attachments: []
  }
}

const state = getDefaultState()

const mutations = {
  updateField,
  set (state, payload) {
    for (const key in payload) {
      Object.prototype.hasOwnProperty.call(state.info, key) && (state.info[key] = payload[key])
    }
  },
  reset (state) {
    Object.assign(state, getDefaultState())
  }
}

const getters = {
  getField
}

const actions = {
  async set ({ commit }, payload) {
    commit('set', payload)
  },
  async reset ({ commit }) {
    commit('reset')
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true
}
