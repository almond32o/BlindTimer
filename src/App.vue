<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

  <!--
    <v-main>
      <HelloWorld/>
    </v-main>
  -->
    <v-main>
      <Timer :blinds="blinds"/>
    </v-main>
    <v-main>
    <Structure :blinds="blinds"/>
    <v-btn @click="show">S</v-btn>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
// import HelloWorld from './components/HelloWorld.vue';
import Timer from './components/Timer.vue'
import Blind from './types/blind'
import Structure from './components/Structure.vue'

export default Vue.extend({
  name: 'App',

  components: {
    // HelloWorld,
    Timer,
    Structure
  },

  data: () => ({
    blinds: [
      new Blind(0,1,2,0,1),
      new Blind(1,2,4,0,1),
      new Blind(2,1000,2000,2000,1),
      new Blind(3,-1,-1,0,1)
    ]
  }),
  methods: {

  }
});
</script>
