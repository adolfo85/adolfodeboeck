import Table from 'react-bootstrap/Table';
import css from './Listado.css';



function Listado() {
  return (
    
    <div className='conteinerlista'>

    <Table className='conteinerlista'   striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Fecha de grabación</th>
         
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
        
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
         
        </tr>
      </tbody>
    </Table>


    </div>

    
  );
}

export default Listado;