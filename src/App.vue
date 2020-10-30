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
    <v-main>
      <Timer :blinds="blinds"/>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          persistent
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Open Structure
            </v-btn>
          </template>
          <v-card>
            <v-row align="stretch" justify="center">
              <v-col style="max-width:10vw">
                <v-row justify="center">
                  <v-list>
                    <v-list-item>
                      <v-btn dark color="primary" width="5rem" @click="dialog=false">Close</v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn dark color="primary" width="5rem" @click="dialog=false">OK</v-btn>
                    </v-list-item>
                  </v-list>
                </v-row>
              </v-col>
              <v-col style="max-width: 60vw">
                <Structure :blinds="blinds"/>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Timer from './components/Timer.vue';
import Blind from './types/blind';
import Structure from './components/Structure.vue';

export default Vue.extend({
  name: 'App',

  components: {
    Timer,
    Structure
  },

  data: () => ({
    blinds: [
      new Blind(0,1,2,0,1),
      new Blind(1,2,4,0,1),
      new Blind(2,1000,2000,2000,1),
      new Blind(3,-1,-1,0,1)
    ],
    dialog: false
  }),
  methods: {

  }
});
</script>
