<template>
  <v-card>
    <v-app-bar
      dense
      fixed
      dark
      color="cyan darken-1"
    >
      <v-toolbar-title style="user-select:none">Edit Structure</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn text @click="closeDialogAndUpdate">Save</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-container>
      <v-row justify="center" style="margin:3rem 0 0 0">
        <v-col style="max-width:50rem">
          <v-data-table
            :headers="headers"
            :items="blinds_"
            :items-per-page="-1"
            disable-sort
            dense
            class="elevation-3"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
        <v-col style="max-width:10rem">
          <v-row justify="center">
            <v-dialog persistent v-model="dialog" max-width="500">
              <template v-slot:activator="{on,attrs}">
                <v-card flat style="position:fixed">
                  <v-row justify="center">
                    <v-btn
                    width="7rem"
                      color="light-blue darken-2"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                    >Add Blind</v-btn>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      width="7rem"
                      color="pink accent-2"
                      dark
                      class="mb-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="setItemToBreak"
                    >Add Break</v-btn>
                  </v-row>
                </v-card>
              </template>
              <v-card>
                <v-card-title>
                  {{ dialogTitle }}
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
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Blind from '@/types/blind'
import { cloneDeep } from 'lodash'

export default Vue.extend({
  name: 'Structure',
  props: {
    blinds: Object as PropType<Array<Blind>>
  },
  data() {
    return {
      blinds_: cloneDeep(this.blinds),
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
      this.dialog = false;
      this.$nextTick(function(): void {
        this.editedIndex = -1;
        this.editedItem = new Blind(0,0,0,0,0);
      });
    },
    editItem(item: Blind): void {
      this.editedIndex = this.blinds_.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
    closeDialog(): void {
      this.$emit('close-dialog');
    },
    closeDialogAndUpdate(): void {
      this.$emit('update-blinds', this.blinds_);
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
    },
    dialogTitle(): string {
      let res = '';
      res += (this.editedIndex === -1 ? 'Add' : 'Edit');
      res += ' ';
      res += (this.editedIsBreak ? 'Break' : 'Blind');
      return res;
    }
  }
})
</script>
