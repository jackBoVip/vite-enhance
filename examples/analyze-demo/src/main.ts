import { createApp } from 'vue'
import { debounce, throttle, cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import App from './App.vue'

// 使用一些库函数来增加 bundle 大小
console.log('Current time:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
console.log('debounce:', typeof debounce)
console.log('throttle:', typeof throttle)
console.log('cloneDeep:', typeof cloneDeep)

createApp(App).mount('#app')
