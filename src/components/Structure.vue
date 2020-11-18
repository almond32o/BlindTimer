<template>
  <v-container>
    <v-row justify="center">
      <v-data-table
        :headers="headers"
        :items="blinds_"
        :items-per-page="-1"
        disable-sort
        dense
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:footer>
          <v-toolbar flat>
            <v-row justify="space-around">
              <v-dialog v-model="dialog" max-width="500">
                <template v-slot:activator="{on,attrs}">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >Add Blind</v-btn>
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="setItemToBreak"
                  >Add Break</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    Add/Edit Blind
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-bind:disabled="editedIsBreak"
                            v-model="editedItem.sb"
                            type="number"
                            label="SB"
                          />
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-bind:disabled="editedIsBreak"
                            v-model="editedItem.bb"
                            type="number"
                            label="BB"
                          />
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-bind:disabled="editedIsBreak"
                            v-model="editedItem.ante"
                            type="number"
                            label="ANTE"
                          />
                        </v-col>
                        <v-col>
                        <v-text-field
                          v-model="editedItem.time"
                          type="number"
                          label="TIME"
                        />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">OK</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-row>
    <v-btn @click="debug">debug</v-btn>
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
          value: 'level',
        },
        {text: 'SB', value: 'sb'},
        {text: 'BB', value: 'bb'},
        {text: 'ANTE', value: 'ante'},
        {text: 'TIME', value: 'time'},
        {text: '', value: 'actions'}
      ],
      dialog: false,
      editedItem: new Blind(0,0,0,0,0),
      editedIndex: -1
    }
  },
  methods: {
    save(): void {
      if (this.editedIndex > -1) {
        Object.assign(this.blinds_[this.editedIndex], this.editedItem);
      } else {
        this.blinds_.push(this.editedItem);
      }
      this.close();
    },
    close(): void {
      this.editedItem = new Blind(0,0,0,0,0);
      this.dialog = false;
      this.editedIndex = -1;
    },
    editItem(item: Blind): void {
      this.editedIndex = this.blinds_.indexOf(item);
      this.editedItem = Object.assign({}, item);
      /*
      new Blind(
        item.level,
        item.sb,
        item.bb,
        item.ante,
        item.time
      );
      */
      this.dialog = true;
    },
    deleteItem(item: Blind): void {
      this.editedIndex = this.blinds_.indexOf(item);
      this.blinds_.splice(this.editedIndex, 1);
      this.editedIndex = -1;
    },
    setItemToBreak(): void {
      this.editedItem = new Blind('BREAK', null, null, null, 0);
    },
    debug(): void {
      console.log(this.editedItem.level, this.editedItem.sb);
    }
  },
  watch: {
    blinds_: {
      handler: function(): void {
        let l = 1;
        for(let i = 0; i < this.blinds_.length; i++) {
          if (this.blinds_[i].level === 'BREAK') continue;
          this.blinds_[i].level = l;
          l++;
        }
      },
      deep: true
    }
  },
  computed: {
    editedIsBreak(): boolean {
      return this.editedItem.level === 'BREAK';
    }
  }
})
</script>
