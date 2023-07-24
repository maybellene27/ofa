<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card
              class="elevation-12"
              tile
              :loading="isLoading"
            >
              <v-card-text>
                {{ message }}
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <router-link
                  class="nav-link"
                  :to="{ name: 'Login' }"
                >
                  <v-btn text>
                    Back to Login
                  </v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import users from '@/utils/webapi/users'

export default {
  name: 'EmailVerified',
  data: () => ({
    message: 'Verifying user email...',
    isLoading: false
  }),
  async created () {
    this.$data.isLoading = true
    const { query } = this.$route
    const qry = `?username=${query.username}&otp=${query.otp}`
    const resp = await users.verifyEmail(qry)
    const jData = await resp.json()
    this.$data.isLoading = false
    this.message = jData.error || jData.message
  }
}
</script>
