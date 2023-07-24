import mD from '@/mixins/masterData'
import { getField, updateField } from 'vuex-map-fields'
import crud from '@/rest/crud'

const state = {
  totalFetched: 0,
  userRole: [],
  institution: [],
  laboratory: [],
  diseaseIndication: [],
  region: [],
  province: [],
  city: [],
  town: [],
  barangay: [],
  userRoleIsLoading: false,
  institutionIsLoading: false,
  laboratoryIsLoading: false,
  regionIsLoading: false,
  provinceIsLoading: false,
  cityIsLoading: false,
  barangayIsLoading: false,
  townIsLoading: false,
  diseaseIndicationIsLoading: false,
  userRoleIsDisabled: true,
  institutionIsDisabled: true,
  laboratoryIsDisabled: true,
  diseaseIndicationIsDisabled: true,
  regionIsDisabled: true,
  provinceIsDisabled: true,
  cityIsDisabled: true,
  barangayIsDisabled: true,
  townIsDisabled: true,
  location: ['region', 'province', 'city', 'barangay', 'town'],
  userList: ['professor', 'auh', 'cid'],
  showSignup: {
    show: false,
    callback: () => {}
  }
}

const mutations = {
  updateField,
  setOpts (state, { type, payload }) {
    state[type] = payload
  },
  clearProvince (state) {
    state.province = []
  },
  clearCity (state) {
    state.city = []
  }
}

const getters = {
  getField,
  getUserRole: state => state.userRole,
  getInstitution: state => state.institution,
  getMeta: state => state,
  getSignup: state => state.showSignup
}

const actions = {
  async getOptions ({ state, commit }, { type, query = '', nested, resetItems = true, req = {} }) {
    state[`${type}IsLoading`] = true
    state[`${type}IsDisabled`] = true

    let collection = type
    state.location.includes(type) && (collection = 'location')
    nested && (collection = nested)

    let response = null
    if (type === 'userRole') {
      const data = await mD.roles(query)
      response = await data.json()
      response.ok = data.ok
    } else if (state.userList.includes(type)) {
      const data = await mD.userList(query)
      response = await data.json()
      response.ok = data.ok
    } else if (collection) {
      const sortBy = type === 'region' ? 'order' : ''
      const qry = {
        queries: req.additionalQuery,
        search: req.searchText,
        sortBy
      }
      if (req.page && req.itemsPerPage) {
        qry.start = (req.page - 1) * req.itemsPerPage
        qry.count = req.itemsPerPage
      }
      req.view && (qry.view = req.view)
      response = await crud(collection).list(qry)
    } else return

    if (!response.ok) {
      commit('setOpts', { type, payload: [] })
    } else {
      resetItems && commit('setOpts', { type, payload: [] })
      // remove combine and always reset. remove reduceNested
      commit('setOpts', { type, payload: actions.reduceNested(state[type].concat(response.entries), type, nested) })
      state.totalFetched = response.total
      return { entries: response.entries, totalFetched: response.total }
    }

    state[`${type}IsLoading`] = false
    state[`${type}IsDisabled`] = false
  },
  reduceNested (data, type, nested) {
    if (!nested) return data
    return data.reduce((curr, key) => {
      if (key[type].length) curr.push(...key[type])
      else curr.push(key[type])
      return curr
    }, [])
  },
  showSignup ({ state }, info) {
    const { callback = () => {} } = info
    state.showSignup.callback = callback
    state.showSignup.show = true
  }
}

export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true
}
