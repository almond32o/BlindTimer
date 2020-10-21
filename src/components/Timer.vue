<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        {{ formatTime }}
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-card class="align-center" outlined width="400" align="center">
        <v-row justify="space-between" align="center">
          <v-col text-align="center">Blinds:</v-col>
          <v-col text-align="center">{{ formatBlinds }}</v-col>
        </v-row>
        <v-row align="space-between">
          <v-col text-align="center">Ante:</v-col>
          <v-col text-align="center">{{ blinds[innerLevel].ante }}</v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row justify="center">
      <v-card outlined width=400 align="center">
        <v-row justify="space-between" align="center">
          <v-col text-align="center">Next:</v-col>
          <v-col text-align="center">{{ formatNextBlinds }}</v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row class="text-center">
      <v-col>
        <v-btn v-if="!isActive" fab @click="start">
          <v-icon large>mdi-play</v-icon>
        </v-btn>
        <v-btn v-else fab @click="stop">
          <v-icon large>mdi-pause</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Blind from '@/types/blind'

export default Vue.extend({
  props: {
    blinds: Object as PropType<Array<Blind>>
  },
  data() {
    return {
      innerLevel: 0,
      sec: 0,
      timerObj: 0,
      isActive: false
    }
  },
  methods: {
    count(): void {
      if (this.sec === 0) {
        this.levelUp();
      }
      if (this.isActive) {
        this.sec--;
      }
    },
    resetTime(): void {
      this.sec = this.blinds[this.innerLevel].time * 60;
    },
    start(): void {
      this.isActive = true;
    },
    stop(): void {
      this.isActive = false;
    },
    levelUp(): void {
      if (this.innerLevel === this.blinds.length - 1) {
        this.stop();
      } else {
        this.innerLevel++
        this.resetTime();
      }
    }
  },
  computed: {
    formatTime(): string {
      const timeStrings = [
        Math.floor(this.sec / 60).toString(),
        (this.sec % 60).toString()
      ].map((str: string): string => {
        return str.padStart(2, '0')
      });
      return timeStrings[0] + ':' + timeStrings[1];
    },
    formatBlinds(): string {
      if (this.blinds[this.innerLevel].isBreak()) {
        return '';
      }
      return this.blinds[this.innerLevel].sb
             + '/'
             + this.blinds[this.innerLevel].bb;
    },
    formatNextBlinds(): string {
      if (this.innerLevel === this.blinds.length - 1) {
        return 'None'
      }
      if (this.blinds[this.innerLevel + 1].isBreak()) {
        return 'Break (' + this.blinds[this.innerLevel + 1].time + 'min)'
      }
      return this.blinds[this.innerLevel + 1].sb + '/' + this.blinds[this.innerLevel + 1].bb +
        '(' + this.blinds[this.innerLevel + 1].ante + ')'
    }
  },
  mounted(): void {
    this.timerObj = setInterval(this.count, 100);
    this.resetTime();
  }
});
</script>

<style lang="scss" scoped>
.border {
  border: solid;
}
</style>