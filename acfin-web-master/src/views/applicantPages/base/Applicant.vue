<template>
  <Dashboard
    show-drawer
    :drawer-title="title"
  >
    <template v-slot:drawer>
      <v-list>
        <v-list-item-group color="primary">
          <DrawerItem
            id="applicantApplicationMenuBtn"
            label="Application"
            :href="{
              name: $s.userRole && $s.userRole.includes('bankApprover') ? 'BankApproverApplicationTable' : 'ApplicantApplicationTable',
              params: {
                page: 1
              }
            }"
            icon="mdi-file-document-multiple"
          />
          <DrawerItem
            v-if="getPrivilege('canExportFinancePartnerDirectory')"
            id="reportMenuBtn"
            label="Reports"
            :href="{ name: 'ApplicantReports' }"
          />
          <v-list-item
            id="applicantLogoutMenuBtn"
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
          id="applicantProfileViewBtn"
          :to="{ name: 'ApplicantProfileView' }"
          style="display: flex;"
        >
          <div style="display: flex;">
            <v-btn
              id="applicantProfileIconBtn"
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
  name: 'Applicant',
  components: {
    Dashboard,
    DrawerItem
  },
  mixins: [metaMixin, alertMixin, privilegeMixin],
  data: () => ({
    $drawer: false,
    title: ''
  }),
  computed: {
    currentRouteName () {
      return this.$route.name
    },
    id () {
      return this.$s.user
    }
  },
  async created () {
    this.$store.dispatch('initPrivileges')
    await this.$s.ready
    this.title = this.$s.userRole && this.$s.userRole[0]
  },
  session: {
    allow: ['External'],
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
