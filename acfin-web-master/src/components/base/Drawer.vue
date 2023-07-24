<template>
  <v-navigation-drawer
    v-model="showDrawer"
    app
    right
    temporary
    width="300px"
    color="#005C9F"
    light
  >
    <v-list-item v-if="title">
      <v-list-item-content>
        <v-list-item-title
          class="title ml-6 mt-10 white--text"
          :class="title.length < 4 ? 'text-uppercase' : 'text-capitalize'"
        >
          <p>
            Hi, <span style="font-weight: 700;">{{ title }}!</span>
          </p>
        </v-list-item-title>
        <v-list-item-subtitle v-if="subtitle">
          {{ subtitle }}
        </v-list-item-subtitle>
        <v-footer
          bottom
          app
          fixed
          padless
        >
          <v-card
            class="flex"
            flat
            tile
            color="#F98F3E"
          >
            <v-card-text
              class="py-2 text-center white--text"
              style="font-weight: 700;"
            >
              &copy; MVAP 2021
            </v-card-text>
          </v-card>
        </v-footer>
      </v-list-item-content>
    </v-list-item>
    <v-list>
      <slot />
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  name: 'Drawer',
  props: {
    value: Boolean,
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined }
  },
  computed: {
    showDrawer: {
      get: function () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  }
}
</script>

<style scoped>
p {
  font-size: 25px;
  text-decoration: underline;
  text-underline-offset: 7px;
}
</style>
