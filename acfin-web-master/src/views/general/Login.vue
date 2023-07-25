<template>
  <div>
    <v-container
      fluid
      class="fill-height container"
      width="50%"
      flat
      padless
    >
      <v-row class="message">
        <v-col>
          <p style="font-size:160%; font-weight: bold; color: black;">This site is under construction.</p>
          <p>Please consult your Sales Executive or Sales Consultant. We apologize for the inconvenience.</p>
        </v-col>
      </v-row>
      <v-row class="justify-center align-center">
            <v-img
              src="../../assets/honda.png"
              max-height="250"
              max-width="250"
              class="ml-0 mr-n14"
            />
            <v-img
              src="../../assets/isuzu.png"
              max-height="250"
              max-width="250"
              class="ml-n15 mr-n14"
            />
            <v-img
              src="../../assets/volkswagen.png"
              max-height="250"
              max-width="250"
              class="ml-n15 mr-n14"
            />
            <v-img
              src="../../assets/kia.png"
              max-height="250"
              max-width="250"
              class="ml-n15 mr-n14"
            />
          </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<style scoped>

.message {
  margin-top: 50px;
  font-family:Bahnschrift Light;
  font-size:120%;
  text-align: center;
  color: #A9A9A9;
}

</style>
