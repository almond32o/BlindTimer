<template>
  <v-app>
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
      new Blind('BREAK',null,null,null,1)
    ],
    dialog: false
  }),
  methods: {

  }
});
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>