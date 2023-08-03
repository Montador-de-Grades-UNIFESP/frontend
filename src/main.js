import { createApp } from 'vue'
import App from './App.vue'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(fas)
library.add(faGithub)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')

