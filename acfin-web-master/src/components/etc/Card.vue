<template>
  <v-card
    flat
    tile
  >
    <v-toolbar
      v-if="showTitle"
      flat
    >
      <v-toolbar-title>
        <slot name="title" />
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-card-text>
      <slot name="content" />
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'Card',
  props: {
    showTitle: Boolean
  }
}
</script>
