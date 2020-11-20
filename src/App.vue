<template>
  <v-app>
    <v-main>
      <Timer :blinds="blinds"/>
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
  }
});
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>