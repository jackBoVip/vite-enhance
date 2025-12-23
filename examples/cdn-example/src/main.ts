// This example demonstrates how the CDN plugin works
// During development: normal imports work as expected
// During build: these imports are replaced with CDN links

import { createApp } from 'vue';
import React from 'react';
import ReactDOM from 'react-dom/client';
import _ from 'lodash';
import axios from 'axios';

// Vue app example
const vueApp = createApp({
  template: `
    <div>
      <h1>Vue App with CDN Plugin</h1>
      <p>Lodash version: {{ lodashVersion }}</p>
      <button @click="fetchData">Fetch Data with Axios</button>
      <pre v-if="data">{{ data }}</pre>
    </div>
  `,
  data() {
    return {
      lodashVersion: _.VERSION,
      data: null as any,
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        this.data = JSON.stringify(response.data, null, 2);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
});

// React component example
const ReactComponent = () => {
  const [data, setData] = React.useState(null);
  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/2');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return React.createElement('div', null,
    React.createElement('h1', null, 'React Component with CDN Plugin'),
    React.createElement('p', null, `Lodash version: ${_.VERSION}`),
    React.createElement('button', { onClick: fetchData }, 'Fetch Data with Axios'),
    data && React.createElement('pre', null, JSON.stringify(data, null, 2))
  );
};

// Mount Vue app
vueApp.mount('#app');

// Mount React component
const reactRoot = document.createElement('div');
reactRoot.id = 'react-app';
document.body.appendChild(reactRoot);
ReactDOM.createRoot(reactRoot).render(React.createElement(ReactComponent));

console.log('CDN Plugin Example loaded successfully!');
console.log('In development: imports work normally');
console.log('In production build: imports are replaced with CDN links');