
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navegador from './components/Nav';
// import Rutas from './routes/Routes';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './pages/About';
import Footer from './components/Footer';




function App() {
  return (
    <>
    <BrowserRouter>
    
        <Navegador />
        
        <Routes>

        <Route path="/about" element={<About />}></Route>





        </Routes>

        <Footer />

    
     
    
         

       
    </BrowserRouter>


       
    </>
  );
}

export default App;
