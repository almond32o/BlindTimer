import Vue from 'vue';
import Vuetify, { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        background: '#2F3241',
        text: '#9FEAF9',
        card: '#3E4654',
        header: colors.cyan.darken4,
        table: colors.blueGrey.darken4
      },
      light: {
        background: '#F6F7FF',
        text: '#518F9A',
        card: colors.cyan.lighten4,
        header: colors.cyan.darken1
      }
    }
  }
});
