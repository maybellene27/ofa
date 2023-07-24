<template>
  <v-app-bar
    app
    :color="isLogin ? '#005C9F' : 'white'"
    flat
    fixed
    extended
    class="pa-6"
    height="50"
  >
    <v-spacer v-if="isLogin" />
    <v-btn
      icon
      :class="isLogin ? '' : 'ml-10'"
      @click="isLogin ? $router.push({
        name: 'LandingPage'
      }) : ''"
    >
      <v-img
        :src="isLogin ? `${$metaData.app.whiteLogo}` : `${$metaData.app.logo}`"
        class="pa-5"
        :max-width="isLogin ? '50%' : '10%'"
        contain
        color="white--text"
      />
    </v-btn>
    <v-spacer />
    <slot name="menu" />
    <v-app-bar-nav-icon
      v-if="showDrawer"
      id="menuBtn"
      @click.stop="$emit('click:drawer')"
    />
  </v-app-bar>
</template>

<script>

export default {
  name: 'AppBar',
  props: {
    showDrawer: Boolean,
    isLogin: Boolean
  }
}
</script>

<style scoped>
  .header {
    padding-top: 30px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 400px;
  }
  .app-bar{
    padding-top: 22px;
    padding-bottom: 10px;
    display: flex;
    justify-content:center;
    align-items: stretch;
  }
</style>
