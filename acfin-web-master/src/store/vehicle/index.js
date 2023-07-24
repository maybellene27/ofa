import { getField, updateField } from 'vuex-map-fields'
const getDefaultState = () => {
  return {
    brand: '',
    model: '',
    variant: '',
    year: '',
    price: '',
    freights: []
  }
}

const state = getDefaultState()

const mutations = {
  updateField,
  set (state, payload) {
    for (const key in payload) {
      Object.prototype.hasOwnProperty.call(state, key) && (state[key] = payload[key])
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
