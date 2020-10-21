<template>
  <div>
    {{ msg }}: {{ sec }}
    <button @click="start">start</button>
    <button @click="stop">stop</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    msg: String
  },
  data() {
    return {
      sec: 0!,
      timerObj: 0!
    }
  },
  methods: {
    count(): void {
      this.sec++;
    },
    start(): void {
      this.timerObj = setInterval(this.count, 1000);
      console.log(this.timerObj);
    },
    stop(): void {
      clearInterval(this.timerObj);
    }
  }
});
</script>
