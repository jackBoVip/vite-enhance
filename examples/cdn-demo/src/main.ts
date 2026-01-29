import { createApp } from 'vue'
import { debounce } from 'lodash-es'
import axios from 'axios'
import App from './App.vue'

// 测试 lodash-es 是否正常工作
const debouncedLog = debounce((msg: string) => {
  console.log('Debounced:', msg)
}, 300)

// 测试 axios 是否正常工作
axios.get('https://api.github.com').then(() => {
  console.log('Axios is working!')
}).catch(() => {
  console.log('Axios request completed')
})

debouncedLog('CDN modules loaded successfully!')

createApp(App).mount('#app')
