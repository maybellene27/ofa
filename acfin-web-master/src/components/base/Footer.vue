<template>
  <v-footer
    app
    color="grey darken-3"
    flat
    padless
    absolute
    height="130"
  >
    <v-row
      class="mt-1"
    >
      <v-col>
        <v-row
          justify="center"
          no-gutters
          class=""
        >
          <v-col
            align="center"
            md="5"
            sm="5"
            cols="12"
          >
            <v-row>
              <v-col>
                <v-btn
                  v-if="isLogin"
                  icon
                  @click="$router.push({
                    name: 'LandingPage'
                  })"
                >
                  <v-img
                    width="150"
                    :src="`${$metaData.app.whiteLogo}`"
                  />
                </v-btn>
                <v-btn
                  v-else
                  icon
                >
                  <v-img
                    width="150"
                    :src="`${$metaData.app.whiteLogo}`"
                  />
                </v-btn>
              </v-col>
              <v-col
                class="white--text"
              >
                <v-row>
                  <span
                    v-if="isLogin"
                    class="white--text mt-3 ml-14 mb-7"
                  >
                    <p>
                      <a
                        @click="$router.push({
                          name: 'Signup'
                        })"
                      >
                        Signup
                      </a>
                    </p>
                  </span>
                  <span
                    v-else
                    class="white--text ml-14 mb-4"
                  >
                    <div class="d-flex">
                      <p>
                        <a
                          @click="$router.push({
                            name: routeName,
                            params: {
                              page: 1
                            }
                          }), clearTable()"
                        >
                          Applications
                        </a>
                      </p>
                      <p
                        v-if="isInternal"
                        class="ml-4"
                      >
                        <a
                          @click="$router.push({
                            name: 'FinancingPartnerTable',
                            params: {
                              page: 1
                            }
                          }), clearTable()"
                        >
                          Financing Partner
                        </a>
                      </p>
                    </div>
                    <v-row
                      v-if="isInternal"
                    >
                      <div class="ml-3">
                        <p>
                          <a
                            @click="$router.push({
                              name: 'VehicleTable',
                              params: {
                                page: 1
                              }
                            }), clearTable()"
                          >
                            Vehicles
                          </a>
                        </p>
                      </div>
                    </v-row>
                  </span>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            align="center"
            md="11"
            sm="11"
            cols="12"
          >
            <hr
              class="white--text"
              style="height:2px; border-width:0; background-color:#E0E0E0"
            >
          </v-col>
        </v-row>
        <v-row
          justify="center"
          no-gutters
        >
          <v-col
            align="center"
            md="10"
            sm="10"
            cols="12"
            class="mb-2"
          >
            <span class="white--text">&copy; AC Motors {{ this.$metaData.app.copyright }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import profile from '@/store/profile'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'Footer',
  props: {
    isLogin: Boolean
  },
  computed: {
    ...mapFields('profile', [
      'info'
    ]),
    isBankApprover () {
      return this.info.userRole.includes('bankApprover')
    },
    isInternal () {
      return this.info.userType === 'Internal'
    },
    routeName () {
      const route = this.isInternal ? 'ApplicationTable' : this.isBankApprover ? 'BankApproverApplicationTable' : 'ApplicantApplicationTable'
      return route
    }
  },
  beforeCreate () {
    if (!this.$store.hasModule('profile')) {
      this.$store.registerModule('profile', profile)
    }
  },
  async created () {
    await this.$s.ready
    await this.getProfile()
  },
  methods: {
    async getProfile () {
      await this.$store.dispatch('profile/get')
    },
    clearTable () {
      const sessionStorage = window.sessionStorage
      sessionStorage.removeItem('filter')
      sessionStorage.removeItem('search')
    }
  }
}
</script>
