<template>
  <v-app :style="style.background">
    <v-main>
      <Timer :blinds="blinds" :styleProp="style"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Timer from '@/components/Timer.vue';

export default Vue.extend({
  name: 'App',

  components: {
    Timer
  },

  computed: {
    theme(): 'dark' | 'light' {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    style(): Record<string,string> {
      return {
        'background': 'background:' + this.$vuetify.theme.themes[this.theme].background?.toString(),
        'text': 'color:' + this.$vuetify.theme.themes[this.theme].text?.toString(),
        'card': 'background:' + this.$vuetify.theme.themes[this.theme].card?.toString()
      }
    }
  },
  mounted(): void {
    console.log(this.style);
  }
});
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>