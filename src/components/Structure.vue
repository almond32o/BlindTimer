<template>
  <v-container>
    <v-main>
      <v-data-table
        :headers="headers"
        :items="blindsTable"
        :items-per-page="5"
        dense
        class="elevation-1"
      />
    </v-main>
    <v-main>
      <v-btn fab @click="add">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Blind from '@/types/blind'

export default Vue.extend({
  name: 'Structure',
  props: {
    blinds: Object as PropType<Array<Blind>>
  },
  data() {
    return {
      blinds_: this.blinds,
      headers: [
        {
          text: 'LEVEL',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {text: 'SB', value: 'sb'},
        {text: 'BB', value: 'bb'}
      ]
    }
  },
  methods: {
    add(): void {
      this.blinds_.push(new Blind(0, 0, 0, 0, 0));
    }
  },
  computed: {
    blindsTable(): Array<Blind> {
      const res = this.blinds_;
      for(let i = 0; i < res.length; i++) {
        res[i].id = i + 1;
      }
      return res
    }
  }

})
</script>