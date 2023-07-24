<template>
  <v-container
    fluid
    class="mb-10"
  >
    <v-row
      class="mt-0"
    >
      <v-col>
        <div
          class="text-h5 font-weight-bold blue--text"
        >
          {{ vm.collectionLabel }}
        </div>
      </v-col>
    </v-row>
    <v-row class="flex-grow-1">
      <v-col>
        <v-card
          tile
          color="secondary"
        >
          <v-card-text>
            <v-data-table
              v-model="vm.selectedLines"
              :show-select="!vm.hideSelect"
              :headers="vm.headers"
              :items="vm.list"
              :options.sync="vm.options"
              :server-items-length="vm.total"
              :footer-props="vm.footerProps"
              :loading="vm.loading"
              item-key="_id"
              class="secondary"
              @update:options="changeTablePage()"
              @toggle-select-all="vm.disableSelect && vm.selectAllToggle"
            >
              <template
                v-if="vm.disableSelect"
                v-slot:[`item.data-table-select`]="{ item, isSelected, select }"
              >
                <v-simple-checkbox
                  :ripple="false"
                  :value="isSelected"
                  :readonly="!item.isSelectable"
                  :disabled="!item.isSelectable"
                  @input="select($event)"
                />
              </template>
              <template v-slot:top>
                <v-row>
                  <v-col
                    cols="12"
                    md="1"
                    sm="1"
                    class="d-flex justify-end mr-0 pr-0 mt-5"
                  >
                    <div>
                      <v-menu
                        v-model="menu"
                        left
                        :nudge-width="550"
                        :close-on-content-click="false"
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon aria-hidden="false">
                              mdi-filter-variant
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-card
                          width="600"
                          class="pa-5"
                          flat
                          color="white"
                        >
                          <v-row>
                            <v-col
                              v-for="(item, idx) in vm.opts.filterActions"
                              :key="idx"
                            >
                              <v-select
                                v-model="filterModel[item.value]"
                                :label="`${item.label}`"
                                :items="item.hasOwnProperty('filterArray') ? item.filterArray : vm.filterArray[idx]"
                                outlined
                                dense
                                @change="filterModelSelect()"
                              />
                            </v-col>
                          </v-row>
                          <v-divider />
                          <v-card-actions>
                            <v-btn
                              text
                              color="brown"
                              @click="clearFilter()"
                            >
                              Clear all filters
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-menu>
                    </div>
                  </v-col>
                  <!-- Search -->
                  <v-col
                    cols="12"
                    md="6"
                    sm="6"
                    class="ml-0 mt-5"
                  >
                    <v-text-field
                      v-if="showLabel(vm.opts.privilege || `canViewAll${vm.roleName}`)"
                      id="tableSearch"
                      v-model.trim="vm.searchWord"
                      placeholder="Search"
                      :prepend-inner-icon="vm.appendSearchIcon ? '' : 'search'"
                      :append-icon="vm.appendSearchIcon? 'search' : ''"
                      :label="getLabel(vm.opts.privilege || `canViewAll${vm.roleName}`, 'Search')"
                      single-line
                      dense
                      solo
                      :loading="vm.loading"
                      :disabled="vm.loading"
                      @update:options="changeTablePage()"
                      @keyup.enter="() => {
                        searchEnter()
                      }"
                    />
                  </v-col>
                  <v-col
                    class="d-flex justify-end mx-0 mt-5"
                  >
                    <template v-for="(item) in vm.opts.tableActions">
                      <template v-if="item.id === 'create'">
                        <v-btn
                          v-if="showLabel(item.privilege || `canCreate${roleName}`)"
                          :id="`${item.id}-btn-default`"
                          :key="`${item.id}-btn-default`"
                          v-bind="item.vBind"
                          :text="item.text"
                          :color="item.color ? item.color : 'green'"
                          :loading="vm.loading"
                          :class="`${item.class} mr-5`"
                          @click="item.action ? item.action() : vm.$router.push({ path: `${vm.parentId}${vm.opts.collectionName}/create`})"
                        >
                          <v-icon class="mr-2">
                            {{ item.icon || 'mdi-plus-circle-outline' }}
                          </v-icon> {{ getLabel(item.privilege || `canCreate${roleName}`, item.label) }}
                        </v-btn>
                      </template>
                      <template
                        v-else-if="item.id === 'delete'"
                      >
                        <v-btn
                          v-if="vm.isCheckItemsSelected && showLabel(item.privilege || `canDelete${roleName}`)"
                          :id="`${item.id}-btn-default`"
                          :key="`${item.id}-btn-default`"
                          :text="item.text"
                          :color="item.color"
                          :loading="vm.loading"
                          v-bind="item.vBind"
                          :class="`${item.class}`"
                          @click="item.action ? item.action() : vm.deleteDialog(item.callback, item.deleteSuccessMessage)"
                        >
                          <v-icon class="mr-2">
                            {{ item.icon || 'mdi-delete' }}
                          </v-icon> {{ getLabel(item.privilege || `canDelete${roleName}`, item.label) }}
                        </v-btn>
                      </template>
                      <template v-else>
                        <v-btn
                          v-if="showLabel(item.privilege)"
                          :id="`${item.id}Btn`"
                          :key="`${item.id}-btn-default`"
                          text
                          :color="item.color"
                          :loading="vm.loading"
                          @click="item.action"
                        >
                          {{ item.privilege ? getLabel(item.privilege, item.label) : item.label }}
                        </v-btn>
                      </template>
                    </template>
                  </v-col>
                </v-row>
              </template>
              <!-- datatable content -->
              <template v-slot:[`item.actions`]="{ item }">
                <v-spacer />
                <template v-for="action in vm.opts.entryActions">
                  <template v-if="action.id === 'view' || action.id === 'edit'">
                    <v-btn
                      v-if="action.hasOwnProperty('show') ? (action.show && showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)) : showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)"
                      :key="action.id"
                      icon
                      :color="getIconColor({
                        role: (action.privilege || `can${capitalize(action.id)}${vm.roleName}`),
                        successColor: action.color
                      })"
                      @click="action.action ? action.action(item) : $router.push({ path: `${vm.parentId}${vm.collectionName}/${action.id}/${item._id}` })"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ action.icon }}
                          </v-icon>
                        </template>
                        <span>{{ capitalize(action.id) }} {{ vm.collectionLabel }}</span>
                      </v-tooltip>
                    </v-btn>
                  </template>
                  <template v-else-if="action.id === 'delete'">
                    <v-btn
                      v-if="action.hasOwnProperty('show') ? (action.show && showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)) : showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)"
                      :key="action.id"
                      icon
                      :color="getIconColor({
                        role: (action.privilege || `can${capitalize(action.id)}${vm.roleName}`),
                        successColor: action.color
                      })"
                      @click="vm.deleteItem"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ action.icon }}
                          </v-icon>
                        </template>
                        <span>{{ capitalize(action.id) }} {{ vm.collectionLabel }}</span>
                      </v-tooltip>
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      v-if="action.hasOwnProperty('show') ? (action.show && showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)) : showLabel(action.privilege || `can${capitalize(action.id)}${vm.roleName}`)"
                      :key="action.id"
                      icon
                      :color="getIconColor({
                        role: (action.privilege || `can${capitalize(action.id)}${vm.roleName}`),
                        successColor: action.color
                      })"
                      @click="action.action()"
                    >
                      <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ action.icon }}
                          </v-icon>
                        </template>
                        <span>{{ capitalize(action.id) }} {{ vm.collectionLabel }}</span>
                      </v-tooltip>
                    </v-btn>
                  </template>
                </template>
                <template />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { privilegeMixin } from 'session-plugin'

export default {
  name: 'CustomTable',
  mixins: [
    privilegeMixin
  ],
  props: {
    crudFormMethods: {
      type: Object,
      default: () => {}
    },
    tableName: {
      type: String,
      default: 'UserTable'
    }
  },
  data: () => ({
    menu: false,
    filterModel: {}
  }),
  computed: {
    vm () {
      return this.crudFormMethods
    },
    page () {
      return this.$route.params.page
    },
    sessionStorage () {
      return window.sessionStorage
    }
  },
  async created () {
    const sessionStorage = window.sessionStorage
    const sessionData = JSON.parse(sessionStorage.getItem('filter'))
    const sessionDataSearch = (sessionStorage.getItem('search'))
    if (sessionData) {
      this.filterModel = sessionData
      this.vm.opts.advancedQuery = this.filterModel
      this.vm.populateTable()
    }
    if (sessionDataSearch) {
      this.vm.searchWord = sessionDataSearch
      await this.searchEnter()
    }
    if (this.vm.options.page !== Number(this.page) && this.page) {
      this.vm.options.page = Number(this.page)
      await this.vm.populateTable()
    }
  },
  methods: {
    async changeTablePage () {
      if (this.vm.options.page !== Number(this.page) && this.page) {
        await this.$router.push({
          name: this.tableName,
          params: {
            page: this.vm.options.page
          }
        })
        this.vm.opts.advancedQuery = this.filterModel
        await this.vm.populateTable()
      } else {
        this.vm.opts.advancedQuery = this.filterModel
        await this.vm.populateTable()
      }
    },
    async filterModelSelect () {
      const sessionStorage = window.sessionStorage
      sessionStorage.setItem('filter', JSON.stringify(this.filterModel))
      this.vm.opts.advancedQuery = this.filterModel
      if (this.vm.options.page !== 1 && this.page) {
        await this.$router.push({
          name: this.tableName,
          params: {
            page: 1
          }
        })
        this.vm.options.page = 1
      }
      await this.vm.populateTable()
    },
    async filterModelCreated () {
      this.vm.opts.advancedQuery = this.filterModel
    },
    async searchEnter () {
      const sessionStorage = window.sessionStorage
      sessionStorage.setItem('search', this.vm.searchWord)
      if (this.vm.options.page !== 1 && this.page) {
        await this.$router.push({
          name: this.tableName,
          params: {
            page: 1
          }
        })
        this.vm.options.page = 1
      }
      await this.vm.populateTable()
    },
    setDefaultValue () {
      if (this.vm.opts.filterActions) {
        this.vm.opts.filterActions.map((option) => {
          if (option.defaultValue) {
            this.filterModel[option.value] = option.defaultValue || ''
          }
        })
      }
    },
    async clearFilter () {
      this.filterModel = {}
      sessionStorage.removeItem('filter')
      this.vm.opts.advancedQuery = {}
      await this.vm.populateTable()
    },
    capitalize (value) {
      if (value) return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
      return ''
    }
  }
}
</script>
