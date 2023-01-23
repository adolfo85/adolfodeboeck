

import css from './Toggle.css'
import guitarra from '../img/guitarra.jpg'

function Toogle() {
 

  return (
    <>

  <div className='containerdiv container Regular shadow'>

    <div className=' mt-5 row'>

    <h1 className="display-6 col-lg-4 ">¿Por qué diseñé esta página?</h1>
    <p className="lead col-lg-4">Decidí aprender programación para encontrar nuevas maneras de comunicarme con quienes disfrutan el arte. 
          Después de mucho esfuerzo y estudio, pude crear esta página para apoyar mi actividad artística como guitarrista de jazz.  
            Mi proyecto consiste en grabar con la mejor calidad posible canciones e improvisaciones que pueden ser descargadas mediante esta web. 
            El valor de la descarga es tan solo un dólar por track, y los archivos son enviados en formato wav. 
            Si estuvieras en condiciones de colaborar con mi trabajo, te agradecería de parte de todos aquellos que me ayudan a ser lo que soy y a hacer lo que hago.
        </p>

      <img src={guitarra} class="rounded float-right col-lg-4 Regular shadow" alt="..."></img>
    </div>
  </div>
    
     
    </>
  );
}
export default Toogle;
