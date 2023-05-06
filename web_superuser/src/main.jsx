import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import { Flowbite } from 'flowbite-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <Flowbite>
          <App className="" /> 
        </Flowbite>
     </BrowserRouter>
  </React.StrictMode>,
)
