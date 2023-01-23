import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function Toogle() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className='m-2'
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        ¿Para qué sirve esta página?
      </Button>
      <Collapse className='m-4' in={open}>
        <div id="example-collapse-text">
          Decidí aprender programación para encontrar nuevas maneras de comunicarme con quienes disfrutan el arte. 
          Después de mucho esfuerzo y estudio, pude crear esta página para apoyar mi actividad artística como guitarrista de jazz.  
            Mi proyecto consiste en grabar con la mejor calidad posible canciones e improvisaciones que pueden ser descargadas mediante esta web. 
            El valor de la descarga es tan solo un dólar por track, y los archivos son enviados en formato wav. 
            Si estuvieras en condiciones de colaborar con mi trabajo, te agradecería de parte de todos aquellos que me ayudar a ser lo que soy y a hacer lo que hago.
        
             
        </div>
       
   
      </Collapse>
    </>
  );
}
export default Toogle;
