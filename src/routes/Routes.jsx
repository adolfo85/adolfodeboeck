// Router:
// 1) Instalar react router dom
// 2) Crear carpeta routes con el archivo Routes
// 3) Importar Routes en el App.js: todo lo que linkeamos en el app.js se hace a través del router
// 4) Importación del browserRouter y Routes en el archivo Routes.jsx: tanto en la parte superior con import como dentro de la función Routes.
// 5) Creación de un componente Home, que va a tener todos los componentes dentro
// 6) Dentro del componente Routes, se importa el componente Route
// 7) Dentro de Route van los path: cada vez que vayamos a home, nuestro path es /
// 8) Dentro del componente al que queremos linquear, ej: Navegador, importamos el compoente link en la parte superior:
// quitamos el nav.link y utilizamos sólo link para el componente home y el about me
// 9) En el componente Home, importa
// -Nota: el nav.link es opcional, pero a diferencia del link que utiliza el href , el nav.link usa el to
// Nota: en tería: los componentes que no están dentro de <Routes> se repiten en todas las páginas??
// Ya no ponemos los componentes en App.js, sino en el componente Routes. El app sólo carga el componente Ruoutes
// Teorías de por qué no funciona: 
// -diego utiliza to en los Nav links en vez de href. El utiliza NavLinks y no Nav.Links. A mí los NavLinks me rompen la página. 
// -Estoy importando los componentes en el index y los componentes del componente Routes no se visualizan
// Algunos ponen el browserRouter en el app.js es correcto???

import React from 'react'
import { DEFAULT_MIN_BREAKPOINT } from 'react-bootstrap/esm/ThemeProvider'
import { BrowserRouter, Routes, Route, useHref } from "react-router-dom"
import Home from '../pages/Home'
// import Navegador from '../components/Nav'
import About from '../pages/About'

const Rutas = () => {

    return (
        <BrowserRouter>
        {/* <Navegador /> */}

         <Routes>
             <Route path='/about' element={About}></Route>
         </Routes>
        
        <Routes>
            <Route path='/' element={Home}></Route>
         </Routes>
        
        </BrowserRouter>


    )
}

export default Rutas