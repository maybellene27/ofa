<template>
  <v-app
    id="inspire"
  >
    <AppBar
      :show-drawer="showDrawer"
      :is-login="isLogin"
      @click:drawer="$data.$drawer = !$data.$drawer"
    >
      <template v-slot:title>
        {{ $data.$meta.app.name }}
      </template>
      <template v-slot:menu>
        <slot name="menu" />
      </template>
    </AppBar>
    <Drawer
      v-model="$data.$drawer"
      :title="drawerTitle"
      :subtitle="drawerSubtitle"
    >
      <slot name="drawer" />
    </Drawer>
    <v-main
      :style="{'background-color': '#fff'}"
      class="mb-16"
    >
      <slot name="content" />
    </v-main>
    <Footer :is-login="isLogin" />
  </v-app>
</template>

<script>
import AppBar from '@/components/base/AppBar'
import Footer from '@/components/base/Footer'
import Drawer from '@/components/base/Drawer'
import { metaMixin } from '@/meta'

export default {
  name: 'App',
  components: {
    AppBar,
    Footer,
    Drawer
  },
  mixins: [metaMixin],
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerTitle: {
      type: String,
      default: undefined
    },
    drawerSubtitle: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    $drawer: false
  })
}
</script>
