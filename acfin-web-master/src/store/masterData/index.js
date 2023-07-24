import crud from '@/rest/crud'
import { getField, updateField } from 'vuex-map-fields'

const getDefaultState = () => {
  return {
    branch: [],
    branchIsLoading: false,
    branchIsDisabled: true,
    financingPartner: [],
    financingPartnerIsLoading: false,
    financingPartnerIsDisabled: true,
    agree: false,
    users: [],
    usersIsLoading: false,
    IsDisabled: true,
    bankApplication: [],
    bankApplicationIsLoading: false,
    bankApplicationIsDisabled: true,
    company: [],
    companyIsLoading: false,
    companyIsDisabled: true,
    vehicle: [],
    vehicleIsLoading: false,
    vehicleIsDisabled: true
  }
}

const state = getDefaultState()

const mutations = {
  updateField,
  setOpts (state, { type, data }) {
    state[type] = data
  },
  reset (state, md) {
    Object.assign(state[md], getDefaultState()[md])
  },
  resetAll (state) {
    Object.assign(state, getDefaultState())
  }
}

const getters = {
  getField
}

const actions = {
  async mdOpts ({ state, commit }, { type, query, customRoute, dataview }) {
    state[`${type}IsLoading`] = true
    const response = await crud(customRoute || type).list({ dataview: dataview[type], advancedQuery: query[type] })
    if (!response.ok) {
      return commit('setOpts', { type, data: [] })
    }

    commit('setOpts', { type, data: response.entries })
    state[`${type}IsLoading`] = false
  },

  initOpts ({ dispatch }, payload = {}) {
    const { mds = [], query = {}, customRoute = [], dataview = {} } = payload
    mds.forEach((type, index) => {
      dispatch('mdOpts', { type, query, customRoute: customRoute[index], dataview })
    })
  },
  async reset ({ commit }, mds) {
    mds.forEach((md) => commit('reset', md))
  },
  async resetAll ({ commit }) {
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
