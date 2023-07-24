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
            <h2>Welcome to <span>Online Financing Page!</span></h2>
          </v-col>
          <v-col class="mt-n3 mr-n3">
            <v-img
              src="../../assets/diagonal2.png"
              max-height="600"
              max-width="200"
              class="diagonal2"
            />
          </v-col>
        </v-row>
        <v-container>
          <v-row class="cars">
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
              class="ml-n15 mr-6"
            />
            <v-col class="ml-15">
              <v-row>
                <v-img
                  src="../../assets/ACMotorsLogo.png"
                  max-height="250"
                  max-width="250"
                  class="mb-5"
                />
              </v-row>
              <v-row>
                <v-btn
                  elevation="2"
                  x-large
                  color="#F98F3E"
                  height="60"
                  width="300"
                  class="white--text"
                  @click="$router.push({ name: 'Login' })"
                >
                  Log In
                </v-btn>
              </v-row>
              <v-row>
                <v-btn
                  elevation="2"
                  x-large
                  color="#005C9F"
                  height="60"
                  width="300"
                  class="white--text"
                  @click="$router.push({
                    name: 'Signup',
                    params: {
                      operation: 'create'
                    } })"
                >
                  Sign Up
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-col class="banks">
            <small>* Partner Banks</small>
            <v-row class="mt-1">
              <v-img
                src="../../assets/bpi.png"
                max-height="120"
                max-width="120"
                class="mx-5"
              />
              <v-img
                src="../../assets/bdo.png"
                max-height="20"
                max-width="120"
                class="mr-5 mt-4"
              />
              <v-img
                src="../../assets/boc.png"
                max-height="40"
                max-width="250"
                class="mr-5 mt-3"
              />
              <v-img
                src="../../assets/eastwest.jpg"
                max-height="30"
                max-width="160"
                class="mr-5 mt-3"
              />
            </v-row>
            <v-row
              class="ml-5"
              align="start"
              style="margin-top:-15px;"
            >
              <v-img
                src="../../assets/cbs.jpg"
                max-height="50"
                max-width="150"
                class="mr-5 mt-8"
              />
              <v-img
                src="../../assets/psbank_logo.png"
                max-height="40"
                max-width="130"
                class="mr-5 mt-8"
              />
              <v-img
                src="../../assets/rcbc.jpeg"
                max-height="70"
                max-width="100"
                class="mr-5 mt-4"
              />
              <v-img
                src="../../assets/maybank.jpg"
                max-height="80"
                max-width="120"
                class="mr-5 mt-4"
              />
              <v-img
                src="../../assets/sb.png"
                max-height="50"
                max-width="180"
                class="mr-5 mt-8"
              />
            </v-row>
          </v-col>
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
  margin-left: 100px;
  margin-top: 15px;
}

button {
  font-size: 20px;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

.banks { margin-left: 250px; }

.cars {
  margin-top: -430px;
  margin-left: 30px;
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
