import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function Toogle() {
  const [open, setOpen] = useState(false);

  return (
    <>

<div class="jumbotron jumbotron-fluid mt-4">
  <div class="container">
    <h1 class="display-4">¿Por qué diseñé esta página?</h1>
    <p class="lead">Decidí aprender programación para encontrar nuevas maneras de comunicarme con quienes disfrutan el arte. 
          Después de mucho esfuerzo y estudio, pude crear esta página para apoyar mi actividad artística como guitarrista de jazz.  
            Mi proyecto consiste en grabar con la mejor calidad posible canciones e improvisaciones que pueden ser descargadas mediante esta web. 
            El valor de la descarga es tan solo un dólar por track, y los archivos son enviados en formato wav. 
            Si estuvieras en condiciones de colaborar con mi trabajo, te agradecería de parte de todos aquellos que me ayudar a ser lo que soy y a hacer lo que hago.
        </p>
  </div>
</div>

    
     
    </>
  );
}
export default Toogle;
