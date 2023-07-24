<template>
  <router-link
    class="nav-link"
    :to="href"
  >
    <v-list-item
      link
      class="mb-1 white--text"
      style="font-weight: 650;"
      dark
      @click="clearTable()"
    >
      <v-list-item-content>
        <v-list-item-title
          :class="`text-wrap ${indent}`"
        >
          <div>
            {{ label }}
          </div>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </router-link>
</template>

<script>
export default {
  name: 'DrawerItem',
  props: {
    label: { type: String, default: undefined },
    href: { type: Object, default: undefined },
    indent: { type: String, default: undefined }
  },
  methods: {
    clearTable () {
      const sessionStorage = window.sessionStorage
      sessionStorage.removeItem('filter')
      sessionStorage.removeItem('search')
    }
  }
}
</script>
