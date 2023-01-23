import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function Toogle() {
  const [open, setOpen] = useState(false);

  return (
    <>

<div class="jumbotron jumbotron-fluid mt-4">
  <div class="container">
    <h1 class="display-4">Listado de grabaciones disponibles</h1>
    <p class="lead">El listado no está ordenado por fecha de grabación. 
        </p>
  </div>
</div>

    
     
    </>
  );
}
export default Toogle;