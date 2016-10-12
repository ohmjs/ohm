'use strict';

var Vue = require('vue');

// Temporarily required until everything is moved into .vue files.
window.Vue = Vue;  // eslint-disable-line no-undef

// Define components.
Vue.component('expanded-input', require('./expanded-input.vue'));
