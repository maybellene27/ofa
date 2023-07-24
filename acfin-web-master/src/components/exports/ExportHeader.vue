<template>
  <v-container>
    <v-row>
      <v-col
        cols="2"
        md="2"
        lg="2"
      >
        <img
          :src="$metaData.app.logo"
          height="80"
          width="150"
        >
      </v-col>
      <v-col
        cols="10"
        md="10"
        lg="10"
        class="header-text"
      >
        <p class="title">
          {{ $metaData.app.department }}
        </p>
        <p class="name font-bold">
          {{ $metaData.app.bureau }}
        </p>
        <p class="title">
          {{ $metaData.app.address }}
        </p>
        <p class="details">
          Landlines: <span class="font-bold">{{ $metaData.app.landline }}</span> ●
          Fax: <span class="font-bold">{{ $metaData.app.fax }}</span>
        </p>
        <p class="details">
          Email: <span class="header-email">{{ $metaData.app.email }}</span> ● Website:
          <span class="font-bold">{{ $metaData.app.website }}</span>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.header-text {
  white-space: nowrap;
  line-height: 0.90;
  padding-left: 20px;
}
.header-email {
  color: #1a1aff;
  font-weight: bold;
  text-decoration: underline;
}
p {
  margin-top: 3px;
}
.font-bold {
  font-weight: 900;
}
.title {
  font-family: Cambria, serif;
  font-size: 11pt;
}
.name {
  font-family: Cambria, serif;
  font-size: 12pt;
}
.details {
  font-family: Cambria, serif;
  font-size: 9pt;
}
</style>
