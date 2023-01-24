import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Toogle from './components/Toggle';
import Listado from './components/Listado';
import Toogle2 from './components/Toggle2';
import Formulario from './components/Formulario';
import Footer from './components/Footer';
import Abaut from './components/About'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />

    {/* <Abaut /> */}

    <Toogle />
    <Toogle2 />
    <Listado />
    <Formulario />
    <Footer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
