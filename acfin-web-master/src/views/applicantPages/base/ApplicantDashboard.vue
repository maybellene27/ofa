<template>
  <v-container>
    <v-row
      align="start"
      justify="center"
    >
      <v-col>
        <v-card tile>
          <v-toolbar flat>
            <v-toolbar-title>
              Welcome to your Dashboard!
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'ApplicantDashboard',
  data: () => ({
    $meta: {
      hasApplication: false,
      hasSubmitted: false,
      isApproved: false,
      hasCertificate: false,
      hasPayment: false,
      appStatus: 'Pending'
    }
  }),
  methods: {
  }
}
</script>

<style scoped>
</style>
