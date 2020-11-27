<template>
  <v-row class="font-weight-light">
    <v-col :style="styleProp.text" class="level" style="max-width:20vw;text-align:center">
      <div v-if="currentStatus==='EMPTY'">
        EMPTY
      </div>
      <div v-else-if="currentStatus==='BREAK'">
        ON BREAK
      </div>
      <div v-else>
        LEVEL {{ this.blinds[this.lv].level }}
      </div>
    </v-col>
    <v-col>
      <v-row style="align-content:center;height:95vh">
        <v-row :style="styleProp.text" class="text-center">
          <v-col class="clock">
            {{ formatTime }}
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-card class="current mb-2 pl-8 pr-8 pt-1 pb-1" color="card" outlined width="60vw">
            <v-row :style="styleProp.text" class="pa-1" justify="space-between" align="center">
              <span>BLINDS:</span>
              <span>{{ formatBlinds }}</span>
            </v-row>
            <v-row :style="styleProp.text" class="pa-1" justify="space-between">
              <span>ANTE:</span>
              <span>{{ formatAnte }}</span>
            </v-row>
          </v-card>
        </v-row>
        <v-row justify="center">
          <v-card class="next pl-5 pr-5 pt-1 pb-1" color="card" outlined width=50vw>
            <v-row :style="styleProp.text" class="pa-1" justify="space-between" align="center">
              <span>NEXT:</span>
              <span>{{ formatNextBlinds }}</span>
            </v-row>
          </v-card>
        </v-row>
        <v-container>
        <v-row justify="center">
            <v-card color="background" flat width="15rem">
              <v-container>
                <v-row justify="space-between">
                  <v-btn color="text" icon outlined @click="addLevel(-1)">
                    <v-icon>mdi-skip-previous</v-icon>
                  </v-btn>
                  <v-btn color="text" icon outlined @click="addTime(30)">
                    <v-icon>mdi-chevron-double-left</v-icon>
                  </v-btn>
                  <v-btn color="text" v-if="!isActive" icon outlined @click="start">
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                  <v-btn color="text" v-else icon outlined @click="stop">
                    <v-icon>mdi-pause</v-icon>
                  </v-btn>
                  <v-btn color="text" icon outlined @click="addTime(-30)">
                    <v-icon>mdi-chevron-double-right</v-icon>
                  </v-btn>
                  <v-btn color="text" icon outlined @click="addLevel(1)">
                    <v-icon>mdi-skip-next</v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-card>
          </v-row>
        </v-container>
      </v-row>
    </v-col>
    <v-col style="max-width:20vw">
      <v-container>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="card" fab v-bind="attrs" v-on="on">
                <v-icon color="text">mdi-table</v-icon>
              </v-btn>
            </template>
            <Structure
              :blinds="blinds"
              @update-blinds="updateBlinds"
              @close-dialog="dialog=false"
              :key="dialog"
            />
          </v-dialog>
        </v-row>
        <v-row justify="center" style="margin:1rem 0">
          <v-btn color="card" fab @click="sound.enable=!sound.enable">
            <v-icon color="text" v-if="sound.enable">mdi-volume-high</v-icon>
            <v-icon color="text" v-else>mdi-volume-off</v-icon>
          </v-btn>
        </v-row>
        <v-row justify="center">
          <v-btn color="card" fab @click="changeTheme">
            <v-icon color="text">mdi-brightness-6</v-icon>
          </v-btn>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Blind from '@/blind'
import Structure from '@/components/Structure.vue'

type Status = 'EMPTY' | 'BREAK' | 'BLIND';

export default Vue.extend({
  props: {
    styleProp: Object
  },
  components: {
    Structure
  },
  data() {
    return {
      blinds: Array<Blind>(),
      lv: 0,
      sec: 0,
      isActive: false,
      dialog: false,
      sound: {
        enable: true,
        oneminute: new Audio('local-audio://oneminute.wav'),
        levelup: new Audio('local-audio://levelup.wav')
      }
    }
  },
  methods: {
    count(): void {
      if (this.isActive && this.sec <= 0) {
        this.levelUp();
      }
      if(this.isActive) {
        this.sec--;
        if (!this.sound.enable) return;
        if (this.sec === 60) {
          this.sound.oneminute.play();
        } else if (this.sec === 0) {
          this.sound.levelup.play();
        }
      }
    },
    resetTime(): void {
      if (this.currentStatus === 'EMPTY') {
        this.sec = 0;
      } else {
        this.sec = this.blinds[this.lv].time * 60;
      }
    },
    start(): void {
      this.isActive = true;
    },
    stop(): void {
      this.isActive = false;
    },
    levelUp(): void {
      if (this.lv >= this.blinds.length - 1) {
        this.stop();
      } else {
        this.lv++
        this.resetTime();
      }
    },
    addTime(n: number): void {
      if (this.currentStatus === 'EMPTY') return;
      this.sec = Math.max(0, Math.min(this.blinds[this.lv].time * 60, this.sec + n));
    },
    addLevel(n: number): void {
      if (this.currentStatus === 'EMPTY') return;
      this.lv = Math.max(0, Math.min(this.blinds.length - 1, this.lv + n));
    },
    updateBlinds(payload: Array<Blind>): void {
      this.blinds = payload;
      this.lv = 0;
      this.resetTime();
      this.dialog = false;
    },
    changeTheme(): void {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
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
      if (this.currentStatus !== 'BLIND') {
        return '-';
      }
      return this.blinds[this.lv].sb
             + '/'
             + this.blinds[this.lv].bb;
    },
    formatNextBlinds(): string {
      if (this.nextStatus === 'EMPTY') {
        return '-'
      }
      if (this.nextStatus === 'BREAK') {
        return 'BREAK (' + this.blinds[this.lv + 1].time + 'min)'
      }
      return this.blinds[this.lv + 1].sb + '/' + this.blinds[this.lv + 1].bb +
        '(' + this.blinds[this.lv + 1].ante + ')'
    },
    formatAnte(): string {
      if (this.currentStatus !== 'BLIND') {
        return '-';
      }
      return this.blinds[this.lv].ante + '';
    },
    currentStatus(): Status {
      if (this.lv > this.blinds.length - 1) {
        return 'EMPTY';
      } else if (this.blinds[this.lv].level === 'BREAK') {
        return 'BREAK';
      }
      return 'BLIND';
    },
    nextStatus(): Status {
      if (this.lv >= this.blinds.length - 1) {
        return 'EMPTY';
      } else if (this.blinds[this.lv + 1].level === 'BREAK') {
        return 'BREAK';
      }
      return 'BLIND';
    }
  },
  mounted(): void {
    setInterval(
      this.count,
      process.env.NODE_ENV !== 'production' ? 100 : 1000
    );
    this.resetTime();
    window.api.on('keypress-space', () => {
      if (!this.dialog) {
        this.isActive = !this.isActive;
      }
    })
  }
});
</script>

<style lang="scss" scoped>
.level {
  font-size: 5vh;
  user-select: none;
}
.clock {
  font-size: 23vh;
  user-select: none;
}
.current {
  font-size: 9vh;
  user-select: none;
}
.next {
  font-size: 6vh;
  user-select: none;
}
</style>