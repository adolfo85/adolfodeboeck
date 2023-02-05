
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navegador from './components/Nav';
// import Rutas from './routes/Routes';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './pages/About';
import Footer from './components/Footer';
import Home from './pages/Home';
import Data from './pages/Data';




function App() {
  return (
    <>
    <BrowserRouter>
    
        <Navegador />
        
        <Routes>

        <Route path="/about" element={<About />}></Route>
        <Route path="/*" element={<Home />}></Route>
        <Route path="/dataanalytics" element={<Data />}></Route>





        </Routes>

        <Footer />

    
     
    
         

       
    </BrowserRouter>


       
    </>
  );
}

export default App;
