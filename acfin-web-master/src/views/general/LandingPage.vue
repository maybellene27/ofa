<template>
  <div>
    <v-container
      fluid
      class="fill-height container"
      width="50%"
      flat
      padless
    >
      <v-col>
        <v-row>
          <v-col class="title mt-10">
          </v-col>
          <v-col class="mt-n3 mr-n3">
            <v-img
              src="../../assets/diagonal2.png"
              max-height="600"
              max-width="500"
              class="diagonal2"
            />
          </v-col>
        </v-row>
        <v-container>
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
              class="ml-15 mr-n14"
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
      </v-col>
      <v-footer
        padless
        flat
        absolute
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col>
            <v-img
              src="../../assets/diagonal1.png"
              max-height="600"
              max-width="200"
              class="ml-n5 mb-n10 diagonal1"
            />
          </v-col>
          <v-col>
            <div class="copyright">
              <h3>Copyright AC Motor 2021</h3>
            </div>
          </v-col>
        </v-row>
      </v-footer>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
span { color: #005C9F; }
button:last-child { margin-top: 15px; }

.container {
  margin: 0;
  padding: 0;
}

.title {
  margin-left: 70px;
  margin-top: 15px;
}

button {
  font-size: 20px;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.banks { margin-left: 250px; }

.message {
  margin-top: -500px;
  margin-left: 30px;
  font-family:Bahnschrift Light;
  font-size:120%;
  text-align: center;
  color: #A9A9A9;
}

small, h3 {
  color: #969696;
  font-weight: bold;
}

.diagonal2 { float: right; }
.diagonal1 { margin-top: -572px; }
.copyright {
  padding-top: 40px;
  margin-top: -35px;
  margin-left: -100px;
}

</style>
