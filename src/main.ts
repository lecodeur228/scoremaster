import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMoon, faSun, faUsers, faUserShield, faArrowLeft, faSignOutAlt, faPlus, faTimes, faSyncAlt, faFlagCheckered, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faMoon, faSun, faUsers, faUserShield, faArrowLeft, faSignOutAlt, faPlus, faTimes, faSyncAlt, faFlagCheckered, faCopy, faCheck)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')