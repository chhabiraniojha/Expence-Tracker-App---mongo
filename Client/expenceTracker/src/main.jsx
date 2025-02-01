import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


import './index.css'
import { BrowserRouter, HashRouter} from 'react-router-dom'

// const [check,setcheck]=useState(false)
// import protectedRoute from './components/protectedRoute/ProtectedRoute.js'
// function Login() {
  
// }

// console.log(check);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>

  </React.StrictMode>,
)


