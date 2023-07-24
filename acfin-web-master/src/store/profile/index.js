import users from '@/utils/webapi/users'

import { getField, updateField } from 'vuex-map-fields'
const getDefaultState = () => {
  return {
    info: {
      fullName: '',
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      email: '',
      createdBy: '',
      updatedBy: '',
      dateCreated: '',
      dateUpdated: '',
      status: '',
      userRole: '',
      userType: 'Internal',
      superUserBank: []
    }
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
  async get ({ dispatch }) {
    const resp = await users.profile()
    const data = await resp.json()
    dispatch('set', data.entry)
  },
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
