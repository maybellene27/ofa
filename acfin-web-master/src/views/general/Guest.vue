<template>
  <Dashboard
    :show-drawer="false"
    :is-login="true"
  >
    <template v-slot:content>
      <router-view @alert="bubbleAlert($event)" />
    </template>
  </Dashboard>
</template>

<script>
import Dashboard from '@/components/base/Dashboard'

export default {
  name: 'Guest',
  components: {
    Dashboard
  }
}
</script>
