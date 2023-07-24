<template>
  <Dashboard
    :show-drawer="true"
    :drawer-title="title"
  >
    <template v-slot:drawer>
      <v-list
        class="mx-4"
        rounded
      >
        <v-list-item-group color="primary">
          <DrawerItem
            v-if="showLabel('canCreateUsers')"
            id="userManagementMenuBtn"
            :label="getLabel('canCreateUsers', 'Users')"
            :href="{ name: 'UserTable', params: { userType: 'admin', page: 1 } }"
          />
          <DrawerItem
            v-if="showLabel('canViewApplication')"
            id="applicationMenuBtn"
            :label="getLabel('canViewApplication', 'Applications')"
            :href="{ name: 'ApplicationTable', params: { page: 1} }"
          />
          <DrawerItem
            v-if="showLabel('canPostFinancingPartner')"
            id="financingPartnerMenuBtn"
            :label="getLabel('canPostFinancingPartner', 'Financing Partners')"
            :href="{ name: 'FinancingPartnerTable', params: { page: 1 } }"
          />
          <DrawerItem
            v-if="showLabel('canPostVehicle')"
            id="vehicleMenuBtn"
            :label="getLabel('canPostVehicle', 'Vehicles')"
            :href="{ name: 'VehicleTable', params: { page: 1 } }"
          />
          <DrawerItem
            v-if="showLabel('canViewAllCompany')"
            id="companyMenuBtn"
            :label="getLabel('canViewAllCompany', 'AC Motors Branch')"
            :href="{ name: 'CompanyTable', params: { page: 1 } }"
          />
          <DrawerItem
            v-if="getPrivilege('canExportFinancePartnerDirectory')"
            id="reportMenuBtn"
            label="Reports"
            :href="{ name: 'Reports' }"
          />
          <v-list-item
            id="LogoutMenuBtn"
            link
            active-class="style"
            @click="logout()"
          >
            <v-list-item-action>
              <v-icon class="white--text">
                mdi-logout
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                class="white--text"
                style="font-weight: 700;"
              >
                LOGOUT
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </template>
    <template v-slot:menu>
      <div style="display: flex; padding: 20px 15px;">
        <div
          class="title"
          style="align-self: center; font-weight: 700;color: black;"
        >
          Welcome Back,
        </div>
        <router-link
          v-if="showLabel('canViewOwnProfile')"
          :to="{ name: 'ProfileView' }"
          style="display: flex;"
        >
          <div style="display: flex;">
            <v-btn
              id="profileIconBtn"
              icon
            >
              <v-icon
                size="40"
                color="#005c9f"
              >
                mdi-account-circle
              </v-icon>
            </v-btn>
          </div>
          <div
            class="title"
            style="align-self: center; font-weight: 400;color: #005c9f;"
          >
            {{ $s.username }}
          </div>
        </router-link>
      </div>
    </template>
    <template v-slot:content>
      <router-view @alert="bubbleAlert($event)" />
    </template>
  </Dashboard>
</template>

<script>
import Dashboard from '@/components/base/Dashboard'
import DrawerItem from '@/components/base/DrawerItem'
import { metaMixin } from '@/meta'
import alertMixin from '@/mixins/alertMixin'
import { privilegeMixin } from 'session-plugin'

export default {
  name: 'Admin',
  components: {
    Dashboard,
    DrawerItem
  },
  mixins: [metaMixin, alertMixin, privilegeMixin],
  data: () => ({
    $drawer: false,
    title: ''
  }),
  async created () {
    this.$store.dispatch('initPrivileges')
    await this.$s.ready
    this.title = this.$s.userRole && this.$s.userRole[0]
  },
  session: {
    allow: ['Internal'],
    userDiscriminator: 'userType'
  },
  methods: {
    logout () {
      this.$s.destroySession()
      const sessionStorage = window.sessionStorage
      sessionStorage.removeItem('filter')
      sessionStorage.removeItem('search')
    }
  }
}
</script>
