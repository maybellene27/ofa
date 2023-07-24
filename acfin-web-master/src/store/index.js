import Vue from 'vue'
import Vuex from 'vuex'
import { systemMode, systemPrivileges } from 'session-plugin'
import { alert, dialog } from 'maroon-vue-components'
import lookups from '@/store/lookups'
import defaults from '@/store/lookups/defaults'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    systemMode,
    systemPrivileges,
    alert,
    dialog,
    lookups,
    defaults
  }
})
