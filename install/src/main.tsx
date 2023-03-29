import {  Flowbite } from 'flowbite-react/lib/esm/components'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Flowbite>
    <App />
    </Flowbite>
  </React.StrictMode>,
)
